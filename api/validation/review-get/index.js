const validateID = require("../id");
const validatePage = require("../page");
const validateReviewSearchTerm = require("./review-search-term");
const validateReviewSort = require("./review-sort-by");

const validateReviewGet = (searchTerm, sortBy, productID, page) => {
    return {
        searchTerm: [searchTerm, validateReviewSearchTerm],
        sortBy: [sortBy, validateReviewSort],
        productID: [productID, async () => {return await validateID(productID, false)}],
        page: [page, validatePage]
    }
};

module.exports = validateReviewGet;