const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require('../../default-validators');

const validator = require('../../validator');

const validateBannerHeaderIsProvided = (header) => {
    return validateIsProvided(header, 'header');
};

const validateBannerHeaderIsString = (header) => {
    return validateIsCorrectType(header, 'header', 'string');
};

const validateBannerHeaderIsCorrectLength = (header) => {
    return validateIsCorrectLength(header, 'header', 2, 50);
};

const validateBannerHeader = async (header) => {
    return await validator(header, [], [validateBannerHeaderIsString, validateBannerHeaderIsCorrectLength], validateBannerHeaderIsProvided);
};

module.exports = validateBannerHeader