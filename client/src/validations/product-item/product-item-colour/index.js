import { validateIsProvided, validateIsCorrectType } from "../../default-validators";
import { ValidationError, ValidationSuccess } from "../../validation-result";

import validator from '../../validator';

const validateProductColourIsProvided = (colour) => {
    return validateIsProvided(colour, 'colour');
};

const validateProductColourIsString = (colour) => {
    return validateIsCorrectType(colour, 'colour', 'string');
};

const validateProductColourIsCorrectFormat = (colour) => {
    if(/^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(colour) === false) return new ValidationError('Colour format must be #RRGGBB or #RGB');
    return new ValidationSuccess();
};

const validateProductColour = async (colour, provided = true) => {
    return await validator(colour, [], [validateProductColourIsString, validateProductColourIsCorrectFormat], validateProductColourIsProvided, provided);
};

export default validateProductColour;