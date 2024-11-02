const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateProductSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateProductSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateProductSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'nameASC', 'nameDESC', 'priceASC', 'priceDESC']);
};

const validateProductSort = async (sort) => {
    return await validator(sort, [], [validateProductSortIsString, validateProductSortContainsCorrectValue], validateProductSortIsProvided);
};

module.exports = validateProductSort