import { validateImageIsCorrectRatio, validateIsProvided } from '../../default-validators';

import validator from '../../validator';

const validateBannerBackgroundIsProvided = (background) => {
    return validateIsProvided(background, 'background');
};

const validateBannerBackgroundIsCorrectRatio = (backgroundBuffer) => {
    return validateImageIsCorrectRatio(backgroundBuffer, 'background', 1.6);
};

const validateBannerBackground = async (backgroundBuffer) => {
    return await validator(backgroundBuffer, [], [validateBannerBackgroundIsCorrectRatio], validateBannerBackgroundIsProvided);
};

const validateBannerBackgroundUpdate = async (backgroundBuffer) => {
    return await validator(backgroundBuffer, [], [validateBannerBackgroundIsCorrectRatio], validateBannerBackgroundIsProvided, false);
};

export default {
    validateBannerBackground,
    validateBannerBackgroundUpdate
};