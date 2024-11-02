const validatePage = require("../page");
const validateBrandSearchTerm = require("./brand-search-term");
const validateBrandSort = require('./brand-sort-by/index');

const validateBrandGet = (page, sortBy, searchTerm) => {
    return {
        page: [page, validatePage],
        sortBy: [sortBy, validateBrandSort],
        searchTerm: [searchTerm, validateBrandSearchTerm]   
    }
};

module.exports = validateBrandGet