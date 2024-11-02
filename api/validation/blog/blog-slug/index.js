const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");

const validator = require('../../validator');

const validateBlogSlugIsProvided = (slug) => {
    return validateIsProvided(slug, 'slug');
};

const validateBlogSlugIsString = (slug) => {
    return validateIsCorrectType(slug, 'slug', 'string');
};

const validateBlogSlugIsCorrectLength = (slug) => {
    return validateIsCorrectLength(slug, 'slug', null, 300);
};

const validateBlogSlug = async (slug) => {
    return await validator(slug, [], [validateBlogSlugIsString, validateBlogSlugIsCorrectLength], validateBlogSlugIsProvided);
};

module.exports = validateBlogSlug