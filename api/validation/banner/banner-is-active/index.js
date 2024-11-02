const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require('../../default-validators');

const validator = require('../../validator');

const validateBannerIsActiveIsProvided = (active) => {
    return validateIsProvided(active, 'active');
};

const validateBannerIsActiveIsBoolean = (active) => {
    return validateIsCorrectType(active, 'active', 'boolean');
};

const validateBannerIsActive = async (active, provided = true) => {
    return await validator(active, [], [validateBannerIsActiveIsBoolean], validateBannerIsActiveIsProvided, provided);
};

module.exports = validateBannerIsActive