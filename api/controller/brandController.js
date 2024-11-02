const generateBrandImagePath = require("../utils/generate-brand-image-path");
const { generate201Created, generate400BadRequest, generate202Accepted, generate204NoContent, generateDatabaseErrorResponse, generate500ServerError, generate200OK, generate404NotFound } = require("../utils/response-generator");
const uploadImage = require("../utils/upload-image");
const massValidator = require("../validation/mass-validator");

const validateID = require('../validation/id');

const { validateBrand, validateBrandUpdate } = require('../validation/brand'); 

const brandService = require('../service/brandService');

const errorMessages = require('../utils/error-messages');
const validateBrandGet = require("../validation/brand-get");
const { LIMIT } = require("../config/api");

const createBrand = async (req, res) => {
    const nameP = req.body?.name;
    const codeP = req.body?.code;
    const imageP = req?.file;

    const brandObject = validateBrand(nameP, codeP, imageP?.buffer);
    const validationResult = await massValidator(brandObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, code } = validationResult.data;

    const uploadImageResult = await uploadImage(imageP, generateBrandImagePath, 'brand/');
    if(!uploadImageResult.success) return generate500ServerError(res);

    const imagePath = uploadImageResult.data;

    const createBrandResult = await brandService.createBrand(name, code, imagePath);
    if(!createBrandResult.success){
        if(createBrandResult.errorCode === "BAE01") createBrandResult.errorMessage = { "name": createBrandResult.errorMessage };
        if(createBrandResult.errorCode === "BAE02") createBrandResult.errorMessage = { "code": createBrandResult.errorMessage };
        return generateDatabaseErrorResponse(res, createBrandResult);
    };

    return generate201Created(res, createBrandResult.data);
};

const updateBrand = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BRAND_NOT_FOUND);

    id = idValidationResult.data;

    const nameP = req.body?.name;
    const codeP = req.body?.code;
    const imageP = req?.file;

    const brandObject = validateBrandUpdate(nameP, codeP, imageP?.buffer);
    const validationResult = await massValidator(brandObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { name, code } = validationResult.data;

    let imagePath = null;
    if(imageP) {
        const uploadImageResult = await uploadImage(imageP, generateBrandImagePath, 'brand/');
        if(!uploadImageResult.success) return generate500ServerError(res);
        imagePath = uploadImageResult.data;
    }

    const updateBrandResult = await brandService.updateBrand(id, name, code, imagePath);
    if(!updateBrandResult.success){
        if(updateBrandResult.errorCode === "BAE01") updateBrandResult.errorMessage = { "name": updateBrandResult.errorMessage };
        if(updateBrandResult.errorCode === "BAE02") updateBrandResult.errorMessage = { "code": updateBrandResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateBrandResult);
    };
    
    return generate202Accepted(res);
};

const deleteBrand = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BRAND_NOT_FOUND);

    id = idValidationResult.data;

    const deleteBrandResult = await brandService.deleteBrand(id);
    if(!deleteBrandResult.success) return generateDatabaseErrorResponse(res, deleteBrandResult);

    return generate204NoContent(res);
};

const getBrandsPublic = async (req, res) => {
    const limit = 100000;
    const offset = 0;
    const sortBy = 'nameASC';

    const getBrandsResult = await brandService.getBrands(null, sortBy, limit, offset);
    if(!getBrandsResult.success) return generateDatabaseErrorResponse(res, getBrandsResult);

    return generate200OK(res, getBrandsResult.data);
};

const getBrandsProtected = async (req, res) => {
    const pageP = req.query?.page || 1;
    const sortByP = req.query?.sortBy || 'nameASC';
    let searchTermP = req.query?.searchTerm;

    const brandObject = validateBrandGet(pageP, sortByP, searchTermP);
    const validationResult = await massValidator(brandObject);

    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { page, sortBy, searchTerm } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getBrandsResult = await brandService.getBrands(searchTerm, sortBy, limit, offset, false);
    if(!getBrandsResult.success) return generateDatabaseErrorResponse(res, getBrandsResult);

    return generate200OK(res, getBrandsResult.data);
};

const getBrandByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BRAND_NOT_FOUND);

    const id = idValidationResult.data;

    const getBrandResult = await brandService.getBrandByID(id, false);
    if(!getBrandResult.success) return generateDatabaseErrorResponse(res, getBrandResult);

    return generate200OK(res, getBrandResult.data);
};

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrandsProtected,
    getBrandsPublic,
    getBrandByID
};
