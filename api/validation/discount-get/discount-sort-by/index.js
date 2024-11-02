const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateDiscountSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateDiscountSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateDiscountSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'percentageASC', 'percentageDESC']);
};

const validateDiscountSort = async (sort) => {
    return await validator(sort, [], [validateDiscountSortIsString, validateDiscountSortContainsCorrectValue], validateDiscountSortIsProvided);
};

module.exports = validateDiscountSort