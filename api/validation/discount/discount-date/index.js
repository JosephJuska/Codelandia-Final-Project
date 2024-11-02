const { validateIsProvided, validateIsCorrectType, validateIsDate } = require('../../default-validators');

const validator = require('../../validator');

const validateDiscountDateIsProvided = (date, valueName) => {
    return validateIsProvided(date, valueName);
};

const validateDiscountDateIsString = (date, valueName) => {
    return validateIsCorrectType(date, valueName, 'string');
};

const validateDiscountDateIsValidDate = (date, valueName) => {
    return validateIsDate(date, valueName);
};

const validateDiscountDate = async (date, valueName, provided = true) => {
    return validator(date, [valueName], [validateDiscountDateIsString, validateDiscountDateIsValidDate], validateDiscountDateIsProvided, provided);
};

module.exports = validateDiscountDate