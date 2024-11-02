const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");

const validator = require('../../validator');

const validateProductNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateProductNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateProductNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 2, 200);
};

const validateProductName = async (name) => {
    return validator(name, [], [validateProductNameIsString, validateProductNameIsCorrectLength], validateProductNameIsProvided);
};

module.exports = validateProductName