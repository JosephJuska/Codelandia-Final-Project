const { validateImageIsCorrectRatio, validateIsProvided } = require('../../default-validators');

const validator = require('../../validator');

const validateCategoryImageIsProvided = (image) => {
    return validateIsProvided(image, 'image');
};

const validateCategoryImageIsCorrectRatio = (imageBuffer) => {
    return validateImageIsCorrectRatio(imageBuffer, 'image', 1);
};

const validateCategoryImage = async (bannerBuffer, provided=true) => {
    return await validator(bannerBuffer, [], [validateCategoryImageIsCorrectRatio], validateCategoryImageIsProvided, provided);
};

module.exports = validateCategoryImage