const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require('../../default-validators');

const validator = require('../../validator');

const validateBannerButtonTextIsProvided = (buttonText) => {
    return validateIsProvided(buttonText, 'buttonText');
};

const validateBannerButtonTextIsString = (buttonText) => {
    return validateIsCorrectType(buttonText, 'buttonText', 'string');
};

const validateBannerButtonTextIsCorrectLength = (buttonText) => {
    return validateIsCorrectLength(buttonText, 'buttonText', 2, 20);
};

const validateBannerButtonText = async (buttonText) => {
    return await validator(buttonText, [], [validateBannerButtonTextIsString, validateBannerButtonTextIsCorrectLength], validateBannerButtonTextIsProvided);
};

module.exports = validateBannerButtonText