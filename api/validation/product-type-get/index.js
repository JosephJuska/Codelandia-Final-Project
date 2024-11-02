const validateProductTypeName = require('../product-type-name');
const validateProductTypeSort = require('./product-type-sort-by');

const validateProductTypeGet = (searchTerm, sortBy) => {
    return {
        searchTerm: [searchTerm, async() => {return await validateProductTypeName(searchTerm, false)}],
        sortBy: [sortBy, validateProductTypeSort]
    };
};

module.exports = validateProductTypeGet;