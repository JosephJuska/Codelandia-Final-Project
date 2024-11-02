const { validateIsCorrectType, validateIsProvided } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateCurrencyRateIsProvided = (rate, valueName) => {
    return validateIsProvided(rate, valueName);
};

const validateCurrencyRateIsNumber = (rate, valueName) => {
    return validateIsCorrectType(rate, valueName, 'number');
};

const validateCurrencyRatePrecision = (rate, valueName) => {
    const regex = /^\d+(\.\d{1,5})?$/;  // Matches numbers with up to 5 decimal places
    if (!regex.test(rate.toString())) return new ValidationError(valueName + ' must be in precision of 5 or less');
    return new ValidationSuccess();
};

const validateCurrencyRate = async (rate, valueName) => {
    return await validator(rate, [valueName], [validateCurrencyRateIsNumber, validateCurrencyRatePrecision], validateCurrencyRateIsProvided);
};

module.exports = validateCurrencyRate;