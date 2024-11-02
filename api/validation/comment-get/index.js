const validateID = require("../id");
const validatePage = require("../page")
const validateCommentSearchTerm = require("./comment-search-term")
const validateCommentSort = require("./comment-sort-by")

const validateCommentGet = (id, searchTerm, sortBy, page) => {
    return {
        id: [id, async () => {return await validateID(id, false)}],
        searchTerm: [searchTerm, validateCommentSearchTerm],
        sortBy: [sortBy, validateCommentSort],
        page: [page, validatePage]
    }
};

module.exports = validateCommentGet