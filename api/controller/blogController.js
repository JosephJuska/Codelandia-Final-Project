const { generate200OK, generate400BadRequest, generate500ServerError, generate201Created, generate204NoContent, generate404NotFound, generate401Unauthorized, generate202Accepted, generateResponse, generateDatabaseErrorResponse } = require("../utils/response-generator");

const errorMessages = require('../utils/error-messages');
const generateBlogImagePath = require("../utils/generate-blog-image-path");
const { validateBlog, validateBlogUpdate } = require("../validation/blog");
const massValidator = require("../validation/mass-validator");

const uploadImage = require('../utils/upload-image');
const blogService = require('../service/blogService');
const generateSlug = require("../utils/generate-slug");
const MDToHTML = require("../utils/md-to-html");
const validateID = require("../validation/id");
const { ROLES } = require("../utils/constants");
const { validateBlogGet } = require("../validation/blog-get");
const validateBlogSlug = require("../validation/blog/blog-slug");

const { LIMIT } = require('../config/api');

const addImage = async (req, res) => {
    const image = req?.file;
    if(!image) return generate400BadRequest(res, errorMessages.mustBeProvided('image'));

    const uploadImageResult = await uploadImage(image, (fileName) => generateBlogImagePath(fileName, 'image'), 'blog/image/');
    if(!uploadImageResult.success) return generate500ServerError(res);

    return generate200OK(res, { path: uploadImageResult.data});
};

const getBlogByID = async (req, res) => {
    const id = req.params?.id;
    const idValidationResult = await validateID(id);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BLOG_NOT_FOUND);
    const blogID = idValidationResult.data;

    const getBlogResult = await blogService.getBlogByID(blogID, null, false);
    if(!getBlogResult.success) return generateDatabaseErrorResponse(res, getBlogResult);

    let blog = getBlogResult.data;

    return generate200OK(res, blog);
};

const getBlogsPublic = async (req, res) => {
    const pageP = req.query?.page || 1;
    let publishedP = true;
    const sortByP = req.query?.sortBy || 'newest';
    let ownerIDP = null;
    let titleP = req.query?.title;

    const validateBlogGetObject = validateBlogGet(pageP, publishedP, sortByP, ownerIDP, titleP);
    const validationResult = await massValidator(validateBlogGetObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);
    
    const { page, published, sortBy, ownerID, title } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getBlogsResult = await blogService.getBlogs(published, sortBy, ownerID, title, limit, offset, true);
    if(!getBlogsResult.success) return generateDatabaseErrorResponse(res, getBlogsResult);

    return generate200OK(res, getBlogsResult.data);
}

const getBlogsProtectedWriter = async (req, res) => {
    const pageP = req.query?.page || 1;
    let publishedP = req.query?.published;
    const sortByP = req.query?.sortBy || 'newest';
    let titleP = req.query?.title;
    let ownersP = [req?.userID]

    const validateBlogGetObject = validateBlogGet(pageP, publishedP, sortByP, ownersP, req.userID, titleP);
    const validationResult = await massValidator(validateBlogGetObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { page, published, sortBy, owners, title } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getBlogsResult = await blogService.getBlogs(published, sortBy, owners, title, limit, offset, false);
    if(!getBlogsResult.success) return generateDatabaseErrorResponse(res, getBlogsResult);

    return generate200OK(res, getBlogsResult.data);
};

const getBlogsProtected = async (req, res) => {
    const pageP = req.query?.page || 1;
    let publishedP = req.query?.published;
    const sortByP = req.query?.sortBy || 'newest';
    let ownersP = req.query?.owners;
    let titleP = req.query?.title;
    
    if (ownersP && typeof ownersP === 'string') ownersP = ownersP.split(',').map(owner => owner.trim());

    const validateBlogGetObject = validateBlogGet(pageP, publishedP, sortByP, ownersP, req.userID, titleP);
    const validationResult = await massValidator(validateBlogGetObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { page, published, sortBy, owners, title } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getBlogsResult = await blogService.getBlogs(published, sortBy, owners, title, limit, offset, false);
    if(!getBlogsResult.success) return generateDatabaseErrorResponse(res, getBlogsResult);

    return generate200OK(res, getBlogsResult.data);
};

const getBlogsList = async (req, res) => {
    const getBlogsResult = await blogService.getBlogsList();
    if(!getBlogsResult.success) return generateDatabaseErrorResponse(res, getBlogsResult);

    return generate200OK(res, getBlogsResult.data);
};

const getBlogBySlug = async (req, res) => {
    const slugP = req.params?.slug;
    const validationResult = await validateBlogSlug(slugP);
    if(!validationResult.success) return generate404NotFound(res, errorMessages.BLOG_NOT_FOUND);
    
    const slug = validationResult.data;

    const hasPrivilege = req?.roleID && req.roleID > ROLES.CUSTOMER_ROLE; 
    if(!hasPrivilege) publishedP = true;

    const getBlogBySlugResult = await blogService.getBlogBySlug(slug, !hasPrivilege);
    if(!getBlogBySlugResult.success) return generateDatabaseErrorResponse(res, getBlogBySlugResult);
    if(!getBlogBySlugResult.data) return generate404NotFound(res, errorMessages.BLOG_NOT_FOUND);

    return generate200OK(res, getBlogBySlugResult.data);
};

const createBlog = async (req, res) => {
    const titleP = req.body?.title;
    const descriptionP = req.body?.description;
    const subDescriptionP = req.body?.subDescription;
    const contentP = req.body?.content;
    const publishedP = req.body?.published;
    const bannerP = req?.file;
    const authorIDP = req.body?.authorID;

    const bannerObject = validateBlog(titleP, descriptionP, subDescriptionP, contentP, publishedP, bannerP?.buffer, authorIDP);
    const validationResult = await massValidator(bannerObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);
    const { title, description, subDescription, content, published, authorID } = validationResult.data;

    const slug = generateSlug(title);

    const uploadImageResult = await uploadImage(bannerP, (fileName) => generateBlogImagePath(fileName, 'banner'), 'blog/banner/');
    if(!uploadImageResult.success) return generate500ServerError(res);

    const bannerPath = uploadImageResult.data;
    const parsedContent = MDToHTML(content);

    const userID = authorID === null ? req.userID : authorID;

    const createBlogResult = await blogService.createBlog(userID, title, slug, bannerPath, description, subDescription, content, parsedContent, published);
    if(!createBlogResult.success){
        if(createBlogResult.errorCode === "BAE01") createBlogResult.errorMessage = { "title": createBlogResult.errorMessage };
        return generateDatabaseErrorResponse(res, createBlogResult);
    };

    return generate201Created(res, createBlogResult.data);
};

const updateBlog = async (req, res) => {
    const id = req.params?.id;
    const idValidationResult = await validateID(id);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BLOG_NOT_FOUND);
    const blogID = idValidationResult.data;

    const titleP = req.body?.title;
    const descriptionP = req.body?.description;
    const subDescriptionP = req.body?.subDescription;
    const contentP = req.body?.content;
    const publishedP = req.body?.published;
    const bannerP = req?.file;
    const authorIDP = req.body?.authorID;

    const bannerObject = validateBlogUpdate(titleP, descriptionP, subDescriptionP, contentP, publishedP, bannerP?.buffer, authorIDP);
    const validationResult = await massValidator(bannerObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error)

    const { title, description, subDescription, content, published, authorID } = validationResult.data;
    const slug = generateSlug(title);

    const parsedContent = MDToHTML(content);
    let bannerPath = null;
    if(bannerP){
        const uploadImageResult = await uploadImage(bannerP, (fileName) => generateBlogImagePath(fileName, 'banner'), 'blog/banner/');
        if(!uploadImageResult.success) return generate500ServerError(res);
        bannerPath = uploadImageResult.data;
    }

    const roleID = req.roleID;
    const finalAuthorID = authorID ? authorID : req.userID;

    const updateResult = await blogService.updateBlog(blogID, finalAuthorID, roleID, title, slug, bannerPath, description, subDescription, content, parsedContent, published);
    if(!updateResult.success){
        if(updateResult.errorCode === "BAE01") updateResult.errorMessage = { "title": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult);
    };

    return generate202Accepted(res);
};

const deleteBlog = async (req, res) => {
    const id = req.params?.id;
    const idValidationResult = await validateID(id);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BLOG_NOT_FOUND);
    const blogID = idValidationResult.data;

    const userID = req.roleID === ROLES.ADMIN_ROLE ? null : req.userID;

    const deleteBLogResult = await blogService.deleteBlogByID(blogID, userID);
    if(!deleteBLogResult.success) return generateDatabaseErrorResponse(res, deleteBLogResult);

    return generate204NoContent(res);
};

module.exports = {
    addImage,

    getBlogBySlug,
    getBlogByID,
    getBlogsPublic,
    getBlogsProtected,
    getBlogsProtectedWriter,
    getBlogsList,
    createBlog,
    updateBlog,
    deleteBlog
};