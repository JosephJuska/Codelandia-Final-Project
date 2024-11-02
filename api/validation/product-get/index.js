const validateBoolean = require("../boolean");
const validateID = require("../id");
const validatePage = require("../page");
const validateProductBasePrice = require("../product/product-base-price");
const validateProductSearchTerm = require("./product-search-term");
const validateProductSort = require("./product-sort-by");

const validateProductGet = (searchTerm, sortBy, isActive, categoryID, brandID, hasDiscount, startPrice, endPrice, page) => {
    return {
        searchTerm: [searchTerm, validateProductSearchTerm],
        sortBy: [sortBy, validateProductSort],
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive', false)}],
        categoryID: [categoryID, async () => {return await validateID(categoryID, false)}],
        brandID: [brandID, async () => {return await validateID(brandID, false)}],
        hasDiscount: [hasDiscount, async () => {return await validateBoolean(hasDiscount, 'hasDiscount', false)}],
        startPrice: [startPrice, validateProductBasePrice],
        endPrice: [endPrice, validateProductBasePrice],
        page: [page, validatePage]
    }
};

module.exports = validateProductGet;