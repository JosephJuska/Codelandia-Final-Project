const validateComment = require('../validation/comment');
const massValidator = require("../validation/mass-validator");

const commentService = require('../service/commentService');

const errorMessages = require('../utils/error-messages');

const { generate201Created, generate400BadRequest, generate200OK, generateDatabaseErrorResponse, generate204NoContent, generate404NotFound } = require("../utils/response-generator");
const validateID = require("../validation/id");
const validatePage = require('../validation/page');

const { LIMIT } = require('../config/api');
const validateCommentGet = require('../validation/comment-get');

const getCommentsProtected = async (req, res) => {
    const idP = req.query?.id;
    const searchTermP = req.query?.searchTerm;
    const sortByP = req.query?.sortBy || 'newest';
    const pageP = req.query?.page || 1;

    const validationObject = validateCommentGet(idP, searchTermP, sortByP, pageP);
    const validationResult = await massValidator(validationObject);

    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { id, searchTerm, sortBy, page } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getCommentsResult = await commentService.getComments(id, searchTerm, sortBy, limit, offset, null, false);
    if(!getCommentsResult.success) return generateDatabaseErrorResponse(res, getCommentsResult);
    
    return generate200OK(res, getCommentsResult.data);
};

const getCommentsPublic = async (req, res) => {
    const idP = req.params?.id;
    const pageP = req.query?.page || 1;

    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res);

    const id = idValidationResult.data;

    const pageValidationResult = await validatePage(pageP);
    if(!pageValidationResult.success) return generate400BadRequest(res, pageValidationResult.error);
    
    const page = pageValidationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getCommentsResult = await commentService.getComments(id, null, 'newest', limit, offset, true);
    if(!getCommentsResult.success) return generateDatabaseErrorResponse(res, getCommentsResult);
    
    return generate200OK(res, getCommentsResult.data);
};

const createComment = async (req, res) => {
    const nameP = req.body?.name;
    const emailP = req.body?.email;
    const contentP = req.body?.content;
    const idP = req.body?.id;

    const commentObject = validateComment(nameP, emailP, contentP, idP);
    const validationResult = await massValidator(commentObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, email, content, id } = validationResult.data;

    const createCommentResult = await commentService.createComment(name, email, content, id);
    if(!createCommentResult.success){
        if(createCommentResult.errorCode === "CAE01") createCommentResult.errorMessage = { "email": createCommentResult.errorMessage };
        return generateDatabaseErrorResponse(res, createCommentResult);
    };

    return generate201Created(res, createCommentResult.data);
};

const deleteComment = async (req, res) => {
    const id = req.params?.id;
    const idValidationResult = await validateID(id);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.COMMENT_NOT_FOUND);

    const blogID = idValidationResult.data;
    const deleteCommentResult = await commentService.deleteComment(blogID);
    if(!deleteCommentResult.success) return generateDatabaseErrorResponse(res, deleteCommentResult);

    return generate204NoContent(res);
};

module.exports = {
    getCommentsProtected,
    getCommentsPublic,
    deleteComment,
    createComment
};