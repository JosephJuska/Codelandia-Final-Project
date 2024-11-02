const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateCommentSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateCommentSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateCommentSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['nameASC', 'nameDESC', 'newest', 'oldest']);
};

const validateCommentSort = async (sort) => {
    return await validator(sort, [], [validateCommentSortIsString, validateCommentSortContainsCorrectValue], validateCommentSortIsProvided);
};

module.exports = validateCommentSort;