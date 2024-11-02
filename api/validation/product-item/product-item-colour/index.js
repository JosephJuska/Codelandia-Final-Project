const { validateIsProvided, validateIsCorrectType } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateProductColourIsProvided = (colour) => {
    return validateIsProvided(colour, 'colour');
};

const validateProductColourIsString = (colour) => {
    return validateIsCorrectType(colour, 'colour', 'string');
};

const validateProductColourIsCorrectFormat = (colour) => {
    if(/^#[0-9a-fA-F]{8}$|#[0-9a-fA-F]{6}$|#[0-9a-fA-F]{4}$|#[0-9a-fA-F]{3}$/.test(colour) === false) return new ValidationError('Colour format must be a valid HEX value');
    return new ValidationSuccess();
};

const validateProductColour = async (colour, provided = true) => {
    return await validator(colour, [], [validateProductColourIsString, validateProductColourIsCorrectFormat], validateProductColourIsProvided, provided);
};

module.exports = validateProductColour