const { validateIsProvided, validateImageIsCorrectRatio } = require("../../default-validators");

const validator = require('../../validator');

const validateBrandImageIsProvided = (imageBuffer) => {
    return validateIsProvided(imageBuffer, 'image');
};

const validateBrandImageIsCorrectRatio = (imageBuffer) => {
    return validateImageIsCorrectRatio(imageBuffer, 'image', 4);
};

const validateBrandImage = async (imageBuffer, provided=true) => {
    return await validator(imageBuffer, [], [validateBrandImageIsCorrectRatio], validateBrandImageIsProvided, provided);
};

module.exports = validateBrandImage