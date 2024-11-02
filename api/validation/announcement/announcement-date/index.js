const { validateIsProvided, validateIsCorrectType, validateIsDate } = require('../../default-validators');

const validator = require('../../validator');

const validateAnnouncementDateIsProvided = (date, valueName) => {
    return validateIsProvided(date, valueName);
};

const validateAnnouncementDateIsString = (date, valueName) => {
    return validateIsCorrectType(date, valueName, 'string');
};

const validateAnnouncementDateIsValidDate = (date, valueName) => {
    return validateIsDate(date, valueName);
};

const validateAnnouncementDate = async (date, valueName, provided=true) => {
    return validator(date, [valueName], [validateAnnouncementDateIsString, validateAnnouncementDateIsValidDate], validateAnnouncementDateIsProvided, provided);
};

module.exports = validateAnnouncementDate