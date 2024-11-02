const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");

const validator = require('../../validator');

const validateBlogDescriptionIsProvided = (description) => {
    return validateIsProvided(description, 'description');
};

const validateBlogDescriptionIsString = (description) => {
    return validateIsCorrectType(description, 'description', 'string');
};

const validateBlogDescriptionIsCorrectLength = (description) => {
    return validateIsCorrectLength(description, 'description', 2, 300);
};

const validateBlogDescription = async (description) => {
    return await validator(description, [], [validateBlogDescriptionIsString, validateBlogDescriptionIsCorrectLength], validateBlogDescriptionIsProvided);
};

module.exports = validateBlogDescription