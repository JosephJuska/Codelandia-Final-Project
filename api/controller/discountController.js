const { generate400BadRequest, generateDatabaseErrorResponse, generate201Created, generate404NotFound, generate202Accepted, generate204NoContent, generate200OK } = require("../utils/response-generator");
const validateDiscount = require("../validation/discount");
const massValidator = require("../validation/mass-validator");

const discountService = require('../service/discountService');
const validateID = require("../validation/id");

const errorMessages = require('../utils/error-messages');

const { LIMIT } = require('../config/api');
const validateDiscountGet = require("../validation/discount-get");

const createDiscount = async (req, res) => {
    const productIDP = req.body?.productID;
    const categoryIDP = req.body?.categoryID;
    const brandIDP = req.body?.brandID;
    const productTypeIDP = req.body?.productTypeID;
    const discountPercentageP = req.body?.discountPercentage;
    const startDateP = req.body?.startDate;
    const endDateP = req.body?.endDate;
    const isActiveP = req.body?.isActive;

    const discountObject = validateDiscount(productIDP, categoryIDP, brandIDP, productTypeIDP, discountPercentageP, startDateP, endDateP, isActiveP);
    const validationResult = await massValidator(discountObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive } = validationResult.data;
    if(startDate > endDate) return generate400BadRequest(res, { endDate: 'endDate must be later than startDate' });
    
    const providedCount = [productID, categoryID, brandID, productTypeID].filter(id => id !== null);
    if(providedCount.length === 0) return generate400BadRequest(res, 'One of productID, categoryID, brandID, productTypeID must be provided');
    if(providedCount.length > 1) return generate400BadRequest(res, 'Only one of productID, categoryID, brandID, productTypeID must be provided');

    const createResult = await discountService.createDiscount(productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive);
    if(!createResult.success){
        if(createResult.errorCode === "PNF00") createResult.errorMessage = { "productID": createResult.errorMessage };
        if(createResult.errorCode === "CNF00") createResult.errorMessage = { "categoryID": createResult.errorMessage };
        if(createResult.errorCode === "BNF00") createResult.errorMessage = { "brandID": createResult.errorMessage };
        if(createResult.errorCode === "PTNF0") createResult.errorMessage = { "productTypeID": createResult.errorMessage };
        return generateDatabaseErrorResponse(res, createResult);
    };

    return generate201Created(res, createResult.data);
};

const updateDiscount = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.DISCOUNT_NOT_FOUND);

    const id = idValidationResult.data;

    const productIDP = req.body?.productID;
    const categoryIDP = req.body?.categoryID;
    const brandIDP = req.body?.brandID;
    const productTypeIDP = req.body?.productTypeID;
    const discountPercentageP = req.body?.discountPercentage;
    const startDateP = req.body?.startDate;
    const endDateP = req.body?.endDate;
    const isActiveP = req.body?.isActive;

    const discountObject = validateDiscount(productIDP, categoryIDP, brandIDP, productTypeIDP, discountPercentageP, startDateP, endDateP, isActiveP);
    const validationResult = await massValidator(discountObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive } = validationResult.data;
    if(startDate > endDate) return generate400BadRequest(res, { endDate: 'endDate must be later than startDate' });
    
    const providedCount = [productID, categoryID, brandID, productTypeID].filter(id => id !== null);
    if(providedCount.length === 0) return generate400BadRequest(res, 'One of productID, categoryID, brandID, productTypeID must be provided');
    if(providedCount.length > 1) return generate400BadRequest(res, 'Only one of productID, categoryID, brandID, productTypeID must be provided');

    const updateResult = await discountService.updateDiscount(id, productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive);
    if(!updateResult.success){
        if(updateResult.errorCode === "PNF00") updateResult.errorMessage = { "productID": updateResult.errorMessage };
        if(updateResult.errorCode === "CNF00") updateResult.errorMessage = { "categoryID": updateResult.errorMessage };
        if(updateResult.errorCode === "BNF00") updateResult.errorMessage = { "brandID": updateResult.errorMessage };
        if(updateResult.errorCode === "PTNF0") updateResult.errorMessage = { "productTypeID": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult);
    };

    return generate202Accepted(res);
};

const deleteDiscount = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.DISCOUNT_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteResult = await discountService.deleteDiscount(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

const getDiscountByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.DISCOUNT_NOT_FOUND);

    const id = idValidationResult.data;

    const getResult = await discountService.getDiscountByID(id);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

const getDiscounts = async (req, res) => {
    const isActiveP = req.query?.isActive;
    const sortByP = req.query?.sortBy;
    const startDateP = req.query?.startDate;
    const endDateP = req.query?.endDate;
    const startPercentageP = req.query?.startPercentage;
    const endPercentageP = req.query?.endPercentage;
    const isProductP = req.query?.isProduct;
    const isCategoryP = req.query?.isCategory;
    const isBrandP = req.query?.isBrand;
    const isProductTypeP = req.query?.isProductType;
    const pageP = req.query?.page || 1;

    const discountObject = validateDiscountGet(isActiveP, sortByP, startDateP, endDateP, startPercentageP, endPercentageP, isProductP, isCategoryP, isBrandP, isProductTypeP, pageP );
    const validationResult = await massValidator(discountObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { isActive, sortBy, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, page } = validationResult.data;
    
    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getResult = await discountService.getDiscounts(isActive, sortBy, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, limit, offset);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

module.exports = {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getDiscountByID,
    getDiscounts
};