const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../default-validators");
const { ValidationError, ValidationSuccess } = require("../validation-result");

const validator = require('../validator');

const validatePasswordIsProvided = (password) => {
    return validateIsProvided(password, 'password');
};

const validatePasswordIsString = (password) => {
    return validateIsCorrectType(password, 'password', 'string');
};

const validatePasswordIsCorrectLength = (password) => {
    return validateIsCorrectLength(password, 'password', 8);
};

const validatePasswordContainsLetter = (password) => {
    if(/[a-zA-Z]/.test(password) === false) return new ValidationError('password must contain a letter');
    return new ValidationSuccess();
};

const validatePasswordContainsUpperCaseLetter = (password) => {
    if(/[A-Z]/.test(password) === false) return new ValidationError('password must contain an uppercase letter');
    return new ValidationSuccess();
};

const validatePasswordContainsLowerCaseLetter = (password) => {
    if(/[a-z]/.test(password) === false) return new ValidationError('password must contain a lowercase letter');
    return new ValidationSuccess();
};

const validatePasswordContainsDigit = (password) => {
    if(/[0-9]/.test(password) === false) return new ValidationError('password must contain a digit');
    return new ValidationSuccess();
};

const validatePasswordContainsSpecialCharacter = (password) => {
    if(/[!@#$%^&*(),._?":{}|<>]/.test(password) === false) return new ValidationError('password must contain a special character');
    return new ValidationSuccess();
};

const validatePassword = async (password, provided = true) => {
    return await validator(password, [], [validatePasswordIsString, validatePasswordIsCorrectLength, validatePasswordContainsLetter, validatePasswordContainsUpperCaseLetter, validatePasswordContainsLowerCaseLetter, validatePasswordContainsDigit, validatePasswordContainsSpecialCharacter], validatePasswordIsProvided, provided);
};

module.exports = validatePassword;