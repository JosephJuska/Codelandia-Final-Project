const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateBrandSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateBrandSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateBrandSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['nameASC', 'nameDESC', 'codeASC', 'codeDESC']);
};

const validateBrandSort = async (sort) => {
    return await validator(sort, [], [validateBrandSortIsString, validateBrandSortContainsCorrectValue], validateBrandSortIsProvided);
};

module.exports = validateBrandSort