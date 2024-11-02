const validateBannerIsActive = require("../banner/banner-is-active");
const validatePage = require("../page");
const validateBannerSort = require("./banner-sort-by");

const validateBannerGet = (page, sortBy, isActive) => {
    return {
        page: [page, validatePage],
        sortBy: [sortBy, validateBannerSort],
        isActive: [isActive, async () => {return await validateBannerIsActive(isActive, false)}]   
    }
};

module.exports = validateBannerGet