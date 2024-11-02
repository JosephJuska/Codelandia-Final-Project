const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");

const validator = require('../../validator');

const validateBlogTitleIsProvided = (title) => {
    return validateIsProvided(title, 'title');
};

const validateBlogTitleIsString = (title) => {
    return validateIsCorrectType(title, 'title', 'string');
};

const validateBlogTitleIsCorrectLength = (title) => {
    return validateIsCorrectLength(title, 'title', 2, 150);
};

const validateBlogTitle = async (title, provided=true) => {
    return await validator(title, [], [validateBlogTitleIsString, validateBlogTitleIsCorrectLength], validateBlogTitleIsProvided, provided);
};

module.exports = validateBlogTitle