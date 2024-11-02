import { validateImageIsCorrectRatio, validateImageIsCorrectSize, validateIsProvided } from '../../default-validators';

import validator from '../../validator';

const validateBannerIsProvided = (banner) => {
    return validateIsProvided(banner, 'banner');
};

const validateBannerIsCorrectRatio = (bannerBuffer) => {
    return validateImageIsCorrectRatio(bannerBuffer, 'banner', 16/9);
};

const validateBannerIsCorrectSize = async (bannerBuffer) => {
    return validateImageIsCorrectSize(bannerBuffer, "banner", 1024 * 1024, '1MB');
};

const validateBlogBanner = async (bannerBuffer) => {
    return await validator(bannerBuffer, [], [validateBannerIsCorrectRatio], validateBannerIsProvided);
};

const validateBlogBannerUpdate = async (bannerBuffer) => {
    return await validator(bannerBuffer, [], [validateBannerIsCorrectRatio], validateBannerIsProvided, false);
};

export default {
    validateBlogBanner,
    validateBannerIsCorrectSize,
    validateBlogBannerUpdate
};