const { validateImageIsCorrectRatio, validateIsProvided } = require('../../default-validators');

const validator = require('../../validator');

const validateBannerBackgroundIsProvided = (background) => {
    return validateIsProvided(background, 'background');
};

const validateBannerBackgroundIsCorrectRatio = (backgroundBuffer) => {
    return validateImageIsCorrectRatio(backgroundBuffer, 'background', 1.6);
};

const validateBannerBackground = async (backgroundBuffer, provided=true) => {
    return await validator(backgroundBuffer, [], [validateBannerBackgroundIsCorrectRatio], validateBannerBackgroundIsProvided, provided);
};

module.exports = validateBannerBackground