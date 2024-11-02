const { validateIsProvided, validateIsCorrectType } = require("../../default-validators");

const validator = require('../../validator');

const validateBlogContentIsProvided = (content) => {
    return validateIsProvided(content, 'content');
};

const validateBlogContentIsString = (content) => {
    return validateIsCorrectType(content, 'content', 'string');
};

const validateBlogContent = async (content) => {
    return await validator(content, [], [validateBlogContentIsString], validateBlogContentIsProvided, false);
};

module.exports = validateBlogContent