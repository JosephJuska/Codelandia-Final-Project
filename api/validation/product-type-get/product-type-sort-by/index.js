const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateProductTypeSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateProductTypeSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateProductTypeSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['nameASC', 'nameDESC', 'productCountASC', 'productCountDESC']);
};

const validateProductTypeSort = async (sort) => {
    return await validator(sort, [], [validateProductTypeSortIsString, validateProductTypeSortContainsCorrectValue], validateProductTypeSortIsProvided);
};

module.exports = validateProductTypeSort