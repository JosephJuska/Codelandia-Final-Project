const { validateIsCorrectType, validateIsCorrectLength, validateIsProvided } = require("../../default-validators");
const { ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateBlogSubDescriptionIsProvided = (subDescription) => {
    return validateIsProvided(subDescription);
}

const validateBlogSubDescriptionIsString = (subDescription) => {
    return validateIsCorrectType(subDescription, 'subDescription', 'string');
};

const validateBlogSubDescriptionIsCorrectLength = (subDescription) => {
    return validateIsCorrectLength(subDescription, 'subDescription', null, 300);
};

const validateBlogSubDescription = async (subDescription) => {
    return await validator(subDescription, [], [validateBlogSubDescriptionIsString, validateBlogSubDescriptionIsCorrectLength], validateBlogSubDescriptionIsProvided, false);
};

module.exports = validateBlogSubDescription