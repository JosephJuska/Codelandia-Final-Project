const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateProductTypeFieldNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateProductTypeFieldNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateProductTypeFieldNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 2, 50);
};

const validateProductTypeFieldNameIsCorrectFormat = (name) => {
    if(/^[a-zA-Z]+[a-zA-Z0-9\s-]*$/.test(name) === false) return new ValidationError('Invalid name format. The name must consist of letters, numbers, spaces and lines, must start with a letter'); 
    return new ValidationSuccess();
};

const validateProductTypeFieldName = async (name) => {
    return await validator(name, [], [validateProductTypeFieldNameIsString, validateProductTypeFieldNameIsCorrectLength, validateProductTypeFieldNameIsCorrectFormat], validateProductTypeFieldNameIsProvided);
};

module.exports = validateProductTypeFieldName