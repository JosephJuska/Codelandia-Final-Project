const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateCategoryNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateCategoryNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateCategoryNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 2, 50);
};

const validateCategoryNameIsCorrectFormat = (name) => {
    if(/^[A-Za-z\s]+$/.test(name) === false) return new ValidationError('name must only contain letters and spaces');
    return new ValidationSuccess();
};

const validateCategoryName = async (name) => {
    return await validator(name, [], [validateCategoryNameIsString, validateCategoryNameIsCorrectLength, validateCategoryNameIsCorrectFormat], validateCategoryNameIsProvided);
};

module.exports = validateCategoryName