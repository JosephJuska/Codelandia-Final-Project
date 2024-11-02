const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators")

const validator = require('../../validator');

const validateCategorySlugIsProvided = (slug) => {
    return validateIsProvided(slug, 'slug');
};

const validateCategorySlugIsString = (slug) => {
    return validateIsCorrectType(slug, 'slug', 'string');
};

const validateCategorySlugIsCorrectLength = (slug) => {
    return validateIsCorrectLength(slug, 'slug', 1, 100);
};

const validateCategorySlug = async (slug) => {
    return validator(slug, [], [validateCategorySlugIsString, validateCategorySlugIsCorrectLength], validateCategorySlugIsProvided);
};

module.exports = validateCategorySlug