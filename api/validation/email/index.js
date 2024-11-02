const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../default-validators");
const emailFormatValidator = require('email-validator');
const { ValidationError, ValidationSuccess } = require("../validation-result");

const validator = require('../validator');

const validateEmailIsProvided = (email) => {
    return validateIsProvided(email, 'email');
};

const validateEmailIsString = (email) => {
    return validateIsCorrectType(email, 'email', 'string');
};

const validateEmailIsCorrectLength = (email) => {
    return validateIsCorrectLength(email, 'email', 5, 300);
};

const validateEmailFormatIsCorrect = (email) => {
    const result = emailFormatValidator.validate(email);
    if(!result) return new ValidationError('email format is incorrect');
    return new ValidationSuccess();
}

const validateEmail = async (email) => {
    return await validator(email, [], [validateEmailIsString, validateEmailIsCorrectLength, validateEmailFormatIsCorrect], validateEmailIsProvided);
};

module.exports = validateEmail