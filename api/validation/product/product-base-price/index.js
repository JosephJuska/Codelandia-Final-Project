const { validateIsProvided, validateIsCorrectType, validateIsFloat, validateIsInRange } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateProductBasePriceIsProvided = (basePrice) => {
    return validateIsProvided(basePrice, 'basePrice');
};

const validateProductBasePriceIsNumber = (basePrice) => {
    return validateIsCorrectType(basePrice, 'basePrice', 'number');
};

const validateProductBasePriceIsCorrectFormat = (basePrice) => {
    const priceString = basePrice.toString();
    if(/^[0-9]+(.[0-9]{1,2})?$/.test(priceString) === false) return new ValidationError('basePrice must be a number with two decimal places');
    return new ValidationSuccess();
};

const validateProductBasePriceIsInRange = (basePrice) => {
    return validateIsInRange(basePrice, 'basePrice', 0, 99999.99);
};

const validateProductBasePrice = async (basePrice) => {
    return await validator(basePrice, [], [validateProductBasePriceIsNumber, validateProductBasePriceIsCorrectFormat, validateProductBasePriceIsInRange], validateProductBasePriceIsProvided);
};

module.exports = validateProductBasePrice