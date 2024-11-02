const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators")

const validator = require('../../validator');

const validateBrandNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateBrandNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateBrandNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 1, 100);
};

const validateBrandName = async (name, provided = true) => {
    return await validator(name, [], [validateBrandNameIsString, validateBrandNameIsCorrectLength], validateBrandNameIsProvided, provided);
};

module.exports = validateBrandName