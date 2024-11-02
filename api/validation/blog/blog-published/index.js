const { validateIsProvided, validateIsCorrectType } = require("../../default-validators");

const validator = require('../../validator');

const validateBlogPublishedIsProvided = (published) => {
    return validateIsProvided(published, 'published');
};

const validateBlogPublishedIsBoolean = (published) => {
    return validateIsCorrectType(published, 'published', 'boolean');
};

const validateBlogPublished = async (published, provided=true) => {
    return await validator(published, [], [validateBlogPublishedIsBoolean], validateBlogPublishedIsProvided, provided);
};

module.exports = validateBlogPublished