const validateBoolean = require("../boolean");
const validatePage = require("../page");
const validateUserRoles = require("./user-roles");
const validateUserSearchTerm = require("./user-search-term");
const validateUserSort = require("./user-sort-by");

const validateUserGet = (isActive, isVerified, roles, searchTerm, sortBy, page) => {
    return {
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive', false)}],
        isVerified: [isVerified, async () => {return await validateBoolean(isVerified, 'isVerified', false)}],
        roles: [roles, validateUserRoles],
        searchTerm: [searchTerm, validateUserSearchTerm],
        sortBy: [sortBy, validateUserSort],
        page: [page, validatePage]
    }
};

module.exports = validateUserGet;