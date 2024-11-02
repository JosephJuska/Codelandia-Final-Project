const validateLink = require("../link");
const validateBannerActiveTill = require("./banner-active-till");
const validateBannerBackground = require("./banner-background");
const validateBannerButtonText = require("./banner-button-text");
const validateBannerHeader = require("./banner-header");
const validateBannerIsActive = require("./banner-is-active");
const validateBannerSubHeader = require("./banner-sub-header");

const validateBanner = (header, subHeader, buttonText, buttonLink, background, isActive, isActiveTill) => {
    return {
        header: [header, validateBannerHeader],
        subHeader: [subHeader, validateBannerSubHeader],
        buttonText: [buttonText, validateBannerButtonText],
        buttonLink: [buttonLink, validateLink],
        background: [background, validateBannerBackground],
        isActive: [isActive, validateBannerIsActive],
        activeTill: [isActiveTill, validateBannerActiveTill]
    }
};

const validateBannerUpdate = (header, subHeader, buttonText, buttonLink, background, isActive, isActiveTill) => {
    return {
        header: [header, validateBannerHeader],
        subHeader: [subHeader, validateBannerSubHeader],
        buttonText: [buttonText, validateBannerButtonText],
        buttonLink: [buttonLink, validateLink],
        background: [background, async () => {return await validateBannerBackground(background, false)}],
        isActive: [isActive, validateBannerIsActive],
        activeTill: [isActiveTill, validateBannerActiveTill]
    }
};

module.exports = {
    validateBanner,
    validateBannerUpdate
};