const { validateImageIsCorrectRatio, validateIsProvided } = require('../../default-validators');

const validator = require('../../validator');

const validateBannerIsProvided = (banner) => {
    return validateIsProvided(banner, 'banner');
};

const validateBannerIsCorrectRatio = (bannerBuffer) => {
    return validateImageIsCorrectRatio(bannerBuffer, 'banner', 16 / 9);
};

const validateBlogBanner = async (bannerBuffer, provided=true) => {
    return await validator(bannerBuffer, [], [validateBannerIsCorrectRatio], validateBannerIsProvided, provided);
};

module.exports = validateBlogBanner