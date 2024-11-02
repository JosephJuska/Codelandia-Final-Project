const validateBoolean = require("../boolean");
const validateDiscountDate = require("../discount/discount-date");
const validateDiscountPercentage = require("../discount/discount-percentage");
const validatePage = require("../page");
const validateDiscountSort = require("./discount-sort-by");

const validateDiscountGet = (isActive, sortBy, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, page) => {
    return {
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive', false)}],
        sortBy: [sortBy, validateDiscountSort],
        startDate: [startDate, async () => {return await validateDiscountDate(startDate, 'startDate', false)}],
        endDate: [endDate, async () => {return await validateDiscountDate(endDate, 'endDate', false)}],
        startPercentage: [startPercentage, async () => {return await validateDiscountPercentage(startPercentage, 'startPercentage')}],
        endPercentage: [endPercentage, async () => {return await validateDiscountPercentage(endPercentage, 'endPercentage')}],
        isProduct: [isProduct, async () => {return await validateBoolean(isProduct, 'isProduct')}],
        isCategory: [isCategory, async () => {return await validateBoolean(isCategory, 'isCategory')}],
        isBrand: [isBrand, async () => {return await validateBoolean(isBrand, 'isBrand')}],
        isProductType: [isProductType, async () => {return await validateBoolean(isProductType, 'isProductType')}],
        page: [page, validatePage]
    };
};

module.exports = validateDiscountGet;