const { generate400BadRequest, generateDatabaseErrorResponse, generate201Created, generate404NotFound, generate204NoContent, generate200OK } = require("../utils/response-generator");
const massValidator = require("../validation/mass-validator");
const validateReview = require("../validation/review");

const reviewService = require('../service/reviewService');
const validateID = require("../validation/id");

const errorMessages = require('../utils/error-messages');
const { ROLES } = require("../utils/constants");
const validatePage = require("../validation/page");

const { LIMIT } = require('../config/api');
const validateReviewGet = require("../validation/review-get");

const createReview = async (req, res) => {
    const titleP = req.body?.title;
    const descriptionP = req.body?.description;
    const reviewP = req.body?.review;
    const productIDP = req.body?.productID;
    const nameP = req.body?.name;
    const emailP = req.body?.email;

    const reviewObject = validateReview(titleP, descriptionP, reviewP, productIDP, nameP, emailP);
    const validationResult = await massValidator(reviewObject);

    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { title, description, review, productID, name, email } = validationResult.data;

    const createResult = await reviewService.createReview(title, description, review, productID, name, email);
    if(!createResult.success){
        if(createResult.errorCode === "PNF00") createResult.errorMessage = { "productID": createResult.errorMessage };
        if(createResult.errorCode === "RAE01") createResult.errorMessage = { "email": createResult.errorMessage };
        return generateDatabaseErrorResponse(res, createResult);
    };

    return generate201Created(res, createResult.data);
};

const deleteReview = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.REVIEW_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteResult = await reviewService.deleteReview(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);
    
    return generate204NoContent(res);
};

const getReviewByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.REVIEW_NOT_FOUND);

    const id = idValidationResult.data;

    const getResult = await reviewService.getReviewByID(id);

    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

const getReviews = async (req, res) => {
    const searchTermP = req.query?.searchTerm;
    const sortByP = req.query?.sortBy;
    const productIDP = req.query?.productID;
    const pageP = req.query?.page || 1;

    const validationObject = validateReviewGet(searchTermP, sortByP, productIDP, pageP);
    const validationResult = await massValidator(validationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { searchTerm, sortBy, productID, page } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getResult = await reviewService.getReviews(searchTerm, sortBy, productID, limit, offset);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

const getReviewsByProductID = async (req, res) => {
    const idP = req.params?.id;
    const pageP = req.query?.page || 1;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.REVIEW_NOT_FOUND);

    const id = idValidationResult.data;

    const pageValidationResult = await validatePage(pageP);
    if(!pageValidationResult.success) return generate400BadRequest(res, pageValidationResult.error);

    const page = pageValidationResult.data;

    const hasPrivilege = req?.roleID && req.roleID === ROLES.ADMIN_ROLE;

    const limit = 20;
    const offset = (page - 1) * limit;

    const getResult = await reviewService.getReviewsByProductID(id, hasPrivilege ? null : true, limit, offset);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

module.exports = {
    createReview,
    deleteReview,
    getReviewByID,
    getReviews,
    getReviewsByProductID,
}