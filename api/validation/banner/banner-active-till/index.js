const { validateIsProvided, validateIsCorrectType, validateIsDate } = require('../../default-validators');

const validator = require('../../validator');

const validateBannerActiveTillIsProvided = (activeTill) => {
    return validateIsProvided(activeTill, 'activeTill');
};

const validateBannerActiveTillIsString = (activeTill) => {
    return validateIsCorrectType(activeTill, 'activeTill', 'string');
};

const validateBannerActiveTillIsValidDate = (activeTill) => {
    return validateIsDate(activeTill, 'activeTill');
};

const validateBannerActiveTill = async (activeTill) => {
    return validator(activeTill, [], [validateBannerActiveTillIsString, validateBannerActiveTillIsValidDate], validateBannerActiveTillIsProvided);
};

module.exports = validateBannerActiveTill