const { validateCategory, validateCategoryUpdate } = require("../validation/category");
const massValidator = require("../validation/mass-validator");

const categoryService = require('../service/categoryService');
const { generateDatabaseErrorResponse, generate400BadRequest, generate201Created, generate204NoContent, generate202Accepted, generate200OK, generate500ServerError, generate404NotFound } = require("../utils/response-generator");
const validateID = require("../validation/id");

const errorMessages = require('../utils/error-messages');

const generateSlug = require('../utils/generate-slug');
const generateCategoryImagePath = require("../utils/generate-category-image-path");
const uploadImage = require("../utils/upload-image");
const buildCategoryTree = require("../utils/build-category-tree");
const validateCategorySlug = require("../validation/category/category-slug");
const validateBoolean = require("../validation/boolean");

const getAllCategoriesPublic = async (req, res) => {
    const categories = await categoryService.getAllCategoriesHierarchy(true);
    if(!categories.success) return generateDatabaseErrorResponse(res, categories);

    const data = buildCategoryTree(categories.data);

    return generate200OK(res, data);
};

const getAllCategoriesProtected = async (req, res) => {
    const categories = await categoryService.getAllCategoriesHierarchy(false);
    if(!categories.success) return generateDatabaseErrorResponse(res, categories);

    const data = buildCategoryTree(categories.data);

    return generate200OK(res, data);
};

const getCategories = async (req, res) => {
    const hasProductTypesP = req.query?.hasProductTypes;
    const validationResult = await validateBoolean(hasProductTypesP, 'hasProductTypes', false);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const hasProductTypes = validationResult.data;
    const categoriesResult = await categoryService.getAllCategories(hasProductTypes, false);
    if(!categoriesResult.success) return generateDatabaseErrorResponse(res, categoriesResult.data);

    return generate200OK(res, categoriesResult.data);
};

const getCategoryBySlug = async (req, res) => {
    const slugP = req.param?.slug || null;

    const validateSlugResult = await validateCategorySlug(slugP);
    if(!validateSlugResult.success) return generate404NotFound(res, errorMessages.CATEGORY_NOT_FOUND);

    const slug = validateSlugResult.data;

    const getCategoryResult = await categoryService.getCategoryBySlug(slug, true);
    if(!getCategoryResult.success) return generateDatabaseErrorResponse(res, getCategoryResult);

    return generate200OK(res, getCategoryResult.data);
};

const getCategoryByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.CATEGORY_NOT_FOUND);

    const id = idValidationResult.data;

    const getCategoryResult = await categoryService.getCategoryByID(id, false);
    if(!getCategoryResult.success) return generateDatabaseErrorResponse(res, getCategoryResult);

    return generate200OK(res, getCategoryResult.data);
};

const createCategory = async (req, res) => {
    const nameP = req.body?.name;
    const parentIDP = req.body?.parentID;
    const productTypeIDP = req.body?.productTypeID;
    const imageP = req?.file;

    const categoryObject = validateCategory(nameP, parentIDP, productTypeIDP, imageP?.buffer);
    const validationResult = await massValidator(categoryObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, parentID, productTypeID } = validationResult.data;
    const slug = generateSlug(name);

    const uploadImageResult = await uploadImage(imageP, generateCategoryImagePath, 'category/');
    if(!uploadImageResult.success) return generate500ServerError(res);

    const imagePath = uploadImageResult.data;

    const createCategoryResult = await categoryService.createCategory(name, slug, parentID, productTypeID, imagePath);
    if(!createCategoryResult.success){
        if(createCategoryResult.errorCode === "CNF10") createCategoryResult.errorMessage = { "parentID": createCategoryResult.errorMessage };
        if(createCategoryResult.errorCode === "PTM00") createCategoryResult.errorMessage = { "productTypeID": createCategoryResult.errorMessage };
        if(createCategoryResult.errorCode === "CAE01") createCategoryResult.errorMessage = { "name": createCategoryResult.errorMessage };
        return generateDatabaseErrorResponse(res, createCategoryResult);
    };
    
    return generate201Created(res, createCategoryResult.data);
};

const updateCategory = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.CATEGORY_NOT_FOUND);

    const id = idValidationResult.data;

    const nameP = req.body?.name;
    const parentIDP = req.body?.parentID;
    const productTypeIDP = req.body?.productTypeID;
    const imageP = req?.file;

    const categoryObject = validateCategoryUpdate(nameP, parentIDP, productTypeIDP, imageP?.buffer);
    const validationResult = await massValidator(categoryObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, parentID, productTypeID } = validationResult.data;
    const slug = generateSlug(name);

    let imagePath = null;
    if(imageP) {
        const uploadImageResult = await uploadImage(imageP, generateCategoryImagePath, 'category/');
        if(!uploadImageResult.success) return generate500ServerError(res);
        imagePath = uploadImageResult.data;
    };

    const updateCategoryResult = await categoryService.updateCategory(id, name, slug, parentID, productTypeID, imagePath);
    if(!updateCategoryResult.success){
        if(["CNF10", "CAS00"].includes(updateCategoryResult.errorCode)) updateCategoryResult.errorMessage = { "parentID": updateCategoryResult.errorMessage };
        if(["PTM01", "CU001", "CU002"].includes(updateCategoryResult.errorCode)) updateCategoryResult.errorMessage = { "productTypeID": updateCategoryResult.errorMessage };
        if(updateCategoryResult.errorCode === "CAE01") updateCategoryResult.errorMessage = { "name": updateCategoryResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateCategoryResult);
    };
    
    return generate202Accepted(res);
};

const deleteCategory = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.CATEGORY_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteCategoryResult = await categoryService.deleteCategory(id);
    if(!deleteCategoryResult.success) return generateDatabaseErrorResponse(res, deleteCategoryResult);

    return generate204NoContent(res);
};

module.exports = {
    createCategory,
    updateCategory,
    deleteCategory,
    getAllCategoriesProtected,
    getAllCategoriesPublic,
    getCategoryByID,
    getCategoryBySlug,
    getCategories
};