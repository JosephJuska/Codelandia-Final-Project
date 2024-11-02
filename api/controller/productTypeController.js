const { generate200OK, generate400BadRequest, generate202Accepted, generate204NoContent, generateDatabaseErrorResponse, generate201Created, generate404NotFound } = require("../utils/response-generator");
const validateProductTypeName = require("../validation/product-type-name");

const productTypeService = require('../service/productTypeService');
const validateProductTypeField = require("../validation/product-type-field");
const massValidator = require("../validation/mass-validator");

const validateID = require('../validation/id');

const errorMessages = require('../utils/error-messages');

const { ROLES } = require('../utils/constants');

const validateProductTypeGet = require("../validation/product-type-get");

const getProductTypeByID = async (req, res) => {
    const idP = req.params?.id;

    const idValidationResult = await validateID(idP, false);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_TYPE_NOT_FOUND);

    const id = idValidationResult.data;

    const result = await productTypeService.getProductTypeByID(id, false);
    if(!result.success) return generateDatabaseErrorResponse(res, result);

    return generate200OK(res, result.data);
};

const getProductTypeByCategoryID = async (req, res) => {
    const idP = req.params?.id;

    const idValidationResult = await validateID(idP, false);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.CATEGORY_NOT_FOUND);

    const id = idValidationResult.data;

    const hasPrivilege = req?.roleID && req.roleID === ROLES.ADMIN_ROLE;
    
    const result = await productTypeService.getProductTypeByCategoryID(id, !hasPrivilege);
    if(!result.success) return generateDatabaseErrorResponse(res, result);

    return generate200OK(res, result.data);
};

const getProductTypes = async (req, res) => {
    const searchTermP = req.query?.searchTerm;
    const sortByP = req.query?.sortBy || 'nameASC';

    const validateObject = validateProductTypeGet(searchTermP, sortByP);
    const validationResult = await massValidator(validateObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { searchTerm, sortBy } = validationResult.data;

    const result = await productTypeService.getProductTypes(searchTerm, sortBy, false);
    if(!result.success) return generateDatabaseErrorResponse(res, result);

    return generate200OK(res, result.data);
};

const createProductType = async (req, res) => {
    const nameP = req.body?.name;
    const nameValidationResult = await validateProductTypeName(nameP);
    if(!nameValidationResult.success) return generate400BadRequest(res, nameValidationResult.error);

    const name = nameValidationResult.data;

    const createResult = await productTypeService.createProductType(name);
    if(!createResult.success){
        if(createResult.errorCode === "PTAE0") createResult.errorMessage = { "name": createResult.errorMessage };
        return generateDatabaseErrorResponse(res, createResult);
    };

    return generate201Created(res, createResult.data);
};

const updateProductType = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_TYPE_NOT_FOUND);

    const productTypeID = idValidationResult.data;

    const nameP = req.body?.name;

    const nameValidationResult = await validateProductTypeName(nameP);
    if(!nameValidationResult.success) return generate400BadRequest(res, nameValidationResult.error);

    const name = nameValidationResult.data;

    const updateResult = await productTypeService.updateProductType(productTypeID, name);
    if(!updateResult.success){
        if(updateResult.errorCode === "PTAE0") updateResult.errorMessage = { "name": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult);
    };

    return generate202Accepted(res);
};

const deleteProductType = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_TYPE_NOT_FOUND);

    const productTypeID = idValidationResult.data;

    const deleteResult = await productTypeService.deleteProductType(productTypeID);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

const addProductTypeField = async (req, res) => {
    const productTypeIDP = req.params?.id;
    const productTypeValidationResult = await validateID(productTypeIDP);
    if(!productTypeValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_TYPE_NOT_FOUND);

    const productTypeID = productTypeValidationResult.data;
    
    const fieldTypeIDP = req.body?.fieldTypeID;
    const nameP = req.body?.name;
    const productTypeFieldObject = validateProductTypeField(fieldTypeIDP, nameP);
    const validationResult = await massValidator(productTypeFieldObject);

    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { fieldTypeID, name } = validationResult.data;

    const createProductTypeFieldResult = await productTypeService.createProductTypeField(productTypeID, fieldTypeID, name);
    if(!createProductTypeFieldResult.success){
        if(createProductTypeFieldResult.errorCode === "FTNF0") createProductTypeFieldResult.errorMessage = { "fieldTypeID": createProductTypeFieldResult.errorMessage };
        if(createProductTypeFieldResult.errorCode === "PTFAE") createProductTypeFieldResult.errorMessage = { "name": createProductTypeFieldResult.errorMessage };
        return generateDatabaseErrorResponse(res, createProductTypeFieldResult);
    };

    return generate201Created(res, createProductTypeFieldResult.data);
};

const updateProductTypeField = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_TYPE_FIELD_NOT_FOUND);

    const productTypeFieldID = idValidationResult.data;

    const fieldTypeIDP = req.body?.fieldTypeID;
    const nameP = req.body?.name;

    const productTypeFieldObject = validateProductTypeField(fieldTypeIDP, nameP);
    const validationResult = await massValidator(productTypeFieldObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { fieldTypeID, name } = validationResult.data;

    const updateProductTypeFieldResult = await productTypeService.updateProductTypeField(productTypeFieldID, fieldTypeID, name);
    if(!updateProductTypeFieldResult.success){
        if(updateProductTypeFieldResult.errorCode === "FTNF0") updateProductTypeFieldResult.errorMessage = { "fieldTypeID": updateProductTypeFieldResult.errorMessage };
        if(updateProductTypeFieldResult.errorCode === "PTFAE") updateProductTypeFieldResult.errorMessage = { "name": updateProductTypeFieldResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateProductTypeFieldResult);
    };

    return generate202Accepted(res);
};

const deleteProductTypeField = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_TYPE_FIELD_NOT_FOUND);

    const productTypeFieldID = idValidationResult.data;

    const deleteResult = await productTypeService.deleteProductTypeField(productTypeFieldID);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

module.exports = {
    getProductTypeByID,
    getProductTypeByCategoryID,
    getProductTypes,
    createProductType,
    updateProductType,
    deleteProductType,
    addProductTypeField,
    updateProductTypeField,
    deleteProductTypeField,
};