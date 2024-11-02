const generateBannerBackgroundPath = require("../utils/generate-banner-background-path");
const { generate400BadRequest, generate500ServerError, generateDatabaseErrorResponse, generate201Created, generate204NoContent, generate200OK, generate202Accepted, generate404NotFound } = require("../utils/response-generator");
const uploadImage = require("../utils/upload-image");
const { validateBanner, validateBannerUpdate } = require("../validation/banner");
const massValidator = require("../validation/mass-validator");

const bannerService = require('../service/bannerService');
const validateID = require("../validation/id");

const errorMessages = require('../utils/error-messages');

const { LIMIT } = require('../config/api');
const validateBannerGet = require("../validation/banner-get");

const getBannersPublic = async (req, res) => {
    const limit = 5;
    const offset = 0;
    const sortBy = 'activeTillASC';
    const isActive = true;

    const getBannersResult = await bannerService.getBanners(isActive, sortBy, limit, offset, true);
    if(!getBannersResult.success) return generateDatabaseErrorResponse(res, getBannersResult);
};

const getBannersProtected = async (req, res) => {
    const pageP = req.query?.page || 1;
    const sortByP = req.query?.sortBy || 'headerASC';
    const isActiveP = req.query?.isActive;

    const bannerObject = validateBannerGet(pageP, sortByP, isActiveP);
    const validateResult = await massValidator(bannerObject);
    if(!validateResult.success) return generate400BadRequest(res, validateResult.error);

    const { page, sortBy, isActive } = validateResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getBannersResult = await bannerService.getBanners(isActive, sortBy, limit, offset, true);
    if(!getBannersResult.success) return generateDatabaseErrorResponse(res, getBannersResult);

    return generate200OK(res, getBannersResult.data);
};

const getBannerByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BANNER_NOT_FOUND);

    const id = idValidationResult.data;

    const getBannerResult = await bannerService.getBannerByID(id, false);
    if(!getBannerResult.success) return generateDatabaseErrorResponse(res, getBannerResult);

    return generate200OK(res, getBannerResult.data);
};

const createBanner = async (req, res) => {
    const headerP = req.body?.header;
    const subHeaderP = req.body?.subHeader;
    const buttonTextP = req.body?.buttonText;
    const buttonLinkP = req.body?.buttonLink;
    const isActiveP = req.body?.isActive;
    const activeTillP = req.body?.activeTill;
    const backgroundP = req?.file;

    const validationObject = validateBanner(headerP, subHeaderP, buttonTextP, buttonLinkP, backgroundP?.buffer, isActiveP, activeTillP);
    const validationResult = await massValidator(validationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { header, subHeader, buttonText, buttonLink, isActive, activeTill } = validationResult.data;

    const uploadImageResult = await uploadImage(backgroundP, generateBannerBackgroundPath, 'banner/');
    if(!uploadImageResult.success) return generate500ServerError(res);

    const backgroundPath = uploadImageResult.data;

    const createBannerResult = await bannerService.createBanner(header, subHeader, backgroundPath, buttonText, buttonLink, isActive, activeTill);
    if(!createBannerResult.success) return generateDatabaseErrorResponse(res, createBannerResult);

    return generate201Created(res, createBannerResult.data);
};

const updateBanner = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BANNER_NOT_FOUND);

    const id = idValidationResult.data;

    const headerP = req.body?.header;
    const subHeaderP = req.body?.subHeader;
    const buttonTextP = req.body?.buttonText;
    const buttonLinkP = req.body?.buttonLink;
    const isActiveP = req.body?.isActive;
    const activeTillP = req.body?.activeTill;
    const backgroundP = req?.file;

    const validationObject = validateBannerUpdate(headerP, subHeaderP, buttonTextP, buttonLinkP, backgroundP?.buffer, isActiveP, activeTillP);
    const validationResult = await massValidator(validationObject);

    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);
    
    const { header, subHeader, buttonText, buttonLink, isActive, activeTill } = validationResult.data;

    let backgroundPath = null;
    if(backgroundP) {
        const uploadImageResult = await uploadImage(backgroundP, generateBannerBackgroundPath, 'banner/');
        if(!uploadImageResult.success) return generate500ServerError(res);

        backgroundPath = uploadImageResult.data;
    };

    const updateBannerResult = await bannerService.updateBanner(id, header, subHeader, backgroundPath, buttonText, buttonLink, isActive, activeTill);
    if(!updateBannerResult.success) return generateDatabaseErrorResponse(res, updateBannerResult);
    
    return generate202Accepted(res);
};

const deleteBanner = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.BANNER_NOT_FOUND);

    const id = idValidationResult.data;

    const deleteBannerResult = await bannerService.deleteBanner(id);
    if(!deleteBannerResult.success) return generateDatabaseErrorResponse(res, deleteBannerResult);

    return generate204NoContent(res);
};

module.exports = {
    getBannersPublic,
    getBannersProtected,
    getBannerByID,
    createBanner,
    updateBanner,
    deleteBanner,
};