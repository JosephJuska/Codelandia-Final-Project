const { generate400BadRequest, generateDatabaseErrorResponse, generate200OK, generate202Accepted, generate201Created, generate204NoContent, generate404NotFound } = require("../utils/response-generator");
const massValidator = require("../validation/mass-validator");
const { validateProductReceive, validateProductUpdate } = require("../validation/product");

const productTypeService = require('../service/productTypeService');
const { validateProductFields } = require("../validation/product/product-fields");

const productService = require('../service/productService');
const generateSlug = require("../utils/generate-slug");
const validateID = require("../validation/id");
const validateProductImage = require("../validation/product-item/product-item-image");
const uploadImage = require("../utils/upload-image");
const generateProductImagePath = require("../utils/generate-product-image-path");
const { validateProductItem, validateProductItemUpdate } = require("../validation/product-item");
const { validateProductVariation, validateProductVariationUpdate } = require("../validation/product-variation");
const { validateProductVariationField, validateProductVariationFieldUpdate } = require("../validation/product-variation-field");
const { validateProductVariationFieldValue } = require("../validation/product-variation-field/product-variation-field-value");

const errorMessages = require('../utils/error-messages');
const validateBoolean = require("../validation/boolean");
const validateProductGet = require("../validation/product-get");
const { LIMIT } = require("../config/api");

const addImage = async (req, res) => {
    const imageP = req?.file;

    const validationResult = await validateProductImage(imageP?.buffer);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const uploadImageResult = await uploadImage(imageP, generateProductImagePath, 'product/');
    if(!uploadImageResult.success) return generate500ServerError(res);

    return generate200OK(res, { path: uploadImageResult.data });
};

const createProduct = async (req, res) => {
    const nameP = req.body?.name;
    const descriptionP = req.body?.description;
    const skuP = req.body?.sku;
    const brandIDP = req.body?.brandID;
    const categoryIDP = req.body?.categoryID;
    const basePriceP = req.body?.basePrice;
    const fieldsP = req.body?.fields;

    const productObject = validateProductReceive(nameP, descriptionP, skuP, brandIDP, categoryIDP, basePriceP, fieldsP);
    const validationResult = await massValidator(productObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, description, sku, brandID, categoryID, basePrice, fields } = validationResult.data;
    const getProductType = await productTypeService.getProductTypeByCategoryID(categoryID);
    if(!getProductType.success) return generateDatabaseErrorResponse(res, getProductType);

    const productType = getProductType.data;
    
    const validateFields = await validateProductFields(fields, productType.fields);
    if(!validateFields.success) return generate400BadRequest(res, validateFields.error);

    const finalFields = JSON.stringify(validateFields.data);

    const slug = generateSlug(name);

    const createResult = await productService.createProduct(name, description, sku, slug, brandID, categoryID, basePrice, finalFields);
    if(!createResult.success){
        if(createResult.errorCode === "BNF00") createResult.errorMessage = { "brandID": createResult.errorMessage };
        if(createResult.errorCode === "PAE01") createResult.errorMessage = { "name": createResult.errorMessage };
        if(createResult.errorCode === "PAE02") createResult.errorMessage = { "sku": createResult.errorMessage };
        return generateDatabaseErrorResponse(res, createResult);
    };

    return generate201Created(res, createResult.data);
};

const updateProduct = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_NOT_FOUND);

    const id = idValidationResult.data;

    const nameP = req.body?.name;
    const descriptionP = req.body?.description;
    const skuP = req.body?.sku;
    const brandIDP = req.body?.brandID;
    const categoryIDP = req.body?.categoryID;
    const basePriceP = req.body?.basePrice;
    const isActiveP = req.body?.isActive;
    const fieldsP = req.body?.fields;

    const productObject = validateProductUpdate(nameP, descriptionP, skuP, brandIDP, categoryIDP, basePriceP, isActiveP, fieldsP);
    const validationResult = await massValidator(productObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, description, sku, brandID, categoryID, basePrice, isActive, fields } = validationResult.data;
    const getProductType = await productTypeService.getProductTypeByCategoryID(categoryID);
    if(!getProductType.success) return generateDatabaseErrorResponse(res, getProductType);

    const productType = getProductType.data;

    const validateFields = await validateProductFields(fields, productType.fields);
    if(!validateFields.success) return generate400BadRequest(res, validateFields.error);

    const finalFields = JSON.stringify(validateFields.data);

    const slug = generateSlug(name);

    const updateResult = await productService.updateProduct(id, name, description, sku, slug, brandID, categoryID, basePrice, isActive, finalFields);
    if(!updateResult.success){
        if(updateResult.errorCode === "BNF00") updateResult.errorMessage = { "brandID": updateResult.errorMessage };
        if(updateResult.errorCode === "PAE01") updateResult.errorMessage = { "name": updateResult.errorMessage };
        if(updateResult.errorCode === "PAE02") updateResult.errorMessage = { "sku": updateResult.errorMessage };
        if(updateResult.errorCode === "PU001") updateResult.errorMessage = { "categoryID": updateResult.errorMessage };
        if(updateResult.errorCode === "PU002") updateResult.errorMessage = { "isActive": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult);
    };

    return generate202Accepted(res);
};

const deleteProduct = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteResult = await productService.deleteProduct(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

const createProductItem = async (req, res) => {
    const productIDP = req.body?.productID;
    const stockP = req.body?.stock;
    const colour1P = req.body?.colour1;
    const colour2P = req.body?.colour2;
    const colour3P = req.body?.colour3;
    const imagePathsP = req.body?.imagePaths;

    const productItemObject = validateProductItem(productIDP, stockP, colour1P, colour2P, colour3P, imagePathsP);
    const validationResult = await massValidator(productItemObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { productID, stock, colour1, colour2, colour3, imagePaths } = validationResult.data;

    const createProductItemResult = await productService.createProductItem(productID, stock, colour1, colour2, colour3, imagePaths);
    if(!createProductItemResult.success){
        if(createProductItemResult.errorCode === 'PIAE0') createProductItemResult.errorMessage = { "colour1": createProductItemResult.errorMessage, "colour2": createProductItemResult.errorMessage, "colour3": createProductItemResult.errorMessage };
        return generateDatabaseErrorResponse(res, createProductItemResult)
    };

    return generate201Created(res, createProductItemResult.data);
};

const updateProductItem = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_ITEM_NOT_FOUND);

    const id = idValidationResult.data;

    const stockP = req.body?.stock;
    const colour1P = req.body?.colour1;
    const colour2P = req.body?.colour2;
    const colour3P = req.body?.colour3;
    const imagePathsP = req.body?.imagePaths;

    const productItemObject = validateProductItemUpdate(stockP, colour1P, colour2P, colour3P, imagePathsP);
    const validationResult = await massValidator(productItemObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { stock, colour1, colour2, colour3, imagePaths } = validationResult.data;

    const updateResult = await productService.updateProductItem(id, stock, colour1, colour2, colour3, imagePaths);
    if(!updateResult.success){
        if(updateProduct.errorCode === 'PIAE0') updateResult.errorMessage = { "colour1": updateResult.errorMessage, "colour2": updateResult.errorMessage, "colour3": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult)
    };

    return generate202Accepted(res);
};

const deleteProductItem = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_ITEM_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteResult = await productService.deleteProductItem(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

const createProductVariation = async (req, res) => {
    const nameP = req.body?.name;
    const stockP = req.body?.stock;
    const productItemIDP = req.body?.productItemID;
    const basePriceP = req.body?.basePrice;

    const variationObject = validateProductVariation(nameP, stockP, productItemIDP, basePriceP);
    const validationResult = await massValidator(variationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, stock, productItemID, basePrice } = validationResult.data;

    const createResult = await productService.createProductVariation(name, stock, productItemID, basePrice);
    if(!createResult.success){
        if(createResult.errorCode === "PVAE0") createResult.errorMessage = { "name": createResult.errorMessage };
        return generateDatabaseErrorResponse(res, createResult);
    };

    return generate201Created(res, createResult.data);
};

const updateProductVariation = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_VARIATION_NOT_FOUND);

    const id = idValidationResult.data;

    const nameP = req.body?.name;
    const stockP = req.body?.stock;
    const basePriceP = req.body?.basePrice;

    const variationObject = validateProductVariationUpdate(nameP, stockP, basePriceP);
    const validationResult = await massValidator(variationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, stock, basePrice } = validationResult.data;

    const updateResult = await productService.updateProductVariation(id, name, stock, basePrice);
    if(!updateResult.success){
        if(updateResult.errorCode === "PVAE0") updateResult.errorMessage = { "name": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult);
    };

    return generate202Accepted(res);
};

const deleteProductVariation = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_VARIATION_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteResult = await productService.deleteProductVariation(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

const createProductVariationField = async (req, res) => {
    const valueP = req.body?.value;
    const productVariationIDP = req.body?.productVariationID;
    const productTypeFieldIDP = req.body?.productTypeFieldID;

    const variationObject = validateProductVariationField(productVariationIDP, productTypeFieldIDP, valueP);
    const validationResult = await massValidator(variationObject);

    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { value, productVariationID, productTypeFieldID } = validationResult.data;

    const getProductTypeField = await productTypeService.getProductTypeFieldByID(productTypeFieldID);
    if(!getProductTypeField.success || !getProductTypeField.data) return generate404NotFound(res, 'Product type field not found');

    const productTypeField = getProductTypeField.data;
    const fieldTypeID = productTypeField.fieldTypeID;

    const validateValueResult = await validateProductVariationFieldValue(value, fieldTypeID);
    if(!validateValueResult.success) return generate400BadRequest(res, { 'value': validateValueResult.error });

    const finalValue = validateValueResult.data;

    const createResult = await productService.createProductVariationField(finalValue, productVariationID, productTypeFieldID);
    if(!createResult.success){
        if(createResult.errorCode === "PTFNF") createResult.errorMessage = { "productTypeFieldID": createResult.errorMessage };
        return generateDatabaseErrorResponse(res, createResult);
    };

    return generate201Created(res, createResult.data);
};

const updateProductVariationField = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_VARIATION_FIELD_NOT_FOUND);

    const id = idValidationResult.data;

    const valueP = req.body?.value;
    const productTypeFieldIDP = req.body?.productTypeFieldID;

    const variationFieldObject = validateProductVariationFieldUpdate(productTypeFieldIDP, valueP);
    const validationResult = await massValidator(variationFieldObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { productTypeFieldID, value } = validationResult.data;

    const getProductTypeField = await productTypeService.getProductTypeFieldByID(productTypeFieldID);
    if(!getProductTypeField.success || !getProductTypeField.data) return generate404NotFound(res, 'Product type field not found');

    const productTypeField = getProductTypeField.data;
    const fieldTypeID = productTypeField.fieldTypeID;

    const validateValueResult = await validateProductVariationFieldValue(value, fieldTypeID);
    if(!validateValueResult.success) return generate400BadRequest(res, { 'value': validateValueResult.error });

    const finalValue = validateValueResult.data;
    
    const updateResult = await productService.updateProductVariationField(id, finalValue, productTypeFieldID);
    if(!updateResult.success){
        if(updateResult.errorCode === "PTFNF") updateResult.errorMessage = { "productTypeFieldID": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult);
    };

    return generate202Accepted(res);
};

const deleteProductVariationField = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_VARIATION_FIELD_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteResult = await productService.deleteProductVariationField(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);

    return generate204NoContent(res);
};

const getProductsList = async (req, res) => {
    const getResult = await productService.getProductsList();
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

const getProductsProtected = async (req, res) => {
    const searchTermP = req.query?.searchTerm;
    const sortByP = req.query?.sortBy || 'nameASC';
    const isActiveP = req.query?.isActive;
    const categoryIDP = req.query?.categoryID;
    const brandIDP = req.query?.brandID;
    const hasDiscountP = req.query?.hasDiscount;
    const startPriceP = req.query?.startPrice;
    const endPriceP = req.query?.endPrice;
    const pageP = req.query?.page || 1;

    const validationObject = validateProductGet(searchTermP, sortByP, isActiveP, categoryIDP, brandIDP, hasDiscountP, startPriceP, endPriceP, pageP);
    const validationResult = await massValidator(validationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { searchTerm, sortBy, isActive, categoryID, brandID, hasDiscount, startPrice, endPrice, page } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getResult = await productService.getProducts(searchTerm, sortBy, isActive, categoryID, brandID, hasDiscount, startPrice, endPrice, limit, offset);
    if(!getResult.success) return generateDatabaseErrorResponse(res, validationResult);

    return generate200OK(res, getResult.data);
};

const getProductByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.PRODUCT_NOT_FOUND);

    const id = idValidationResult.data;

    const isActiveP = req.query?.isActive;
    const validationResult = await validateBoolean(isActiveP, 'isActive', false);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const isActive = validationResult.data;

    const getResult = await productService.getProductByID(id, isActive);
    if(!getResult.success) return generateDatabaseErrorResponse(res, getResult);

    return generate200OK(res, getResult.data);
};

module.exports = {
    addImage,

    createProduct,
    updateProduct,
    deleteProduct,

    createProductItem,
    updateProductItem,
    deleteProductItem,

    createProductVariation,
    updateProductVariation,
    deleteProductVariation,

    createProductVariationField,
    updateProductVariationField,
    deleteProductVariationField,

    getProductsList,
    getProductByID,
    getProductsProtected
};