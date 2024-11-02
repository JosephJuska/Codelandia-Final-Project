import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "..//default-validators";
import { ValidationError, ValidationSuccess } from "../validation-result";

import validator from '../validator';

const validateProductTypeFieldNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateProductTypeFieldNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateProductTypeFieldNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 2, 50);
};

const validateProductTypeFieldNameIsCorrectFormat = (name) => {
    if(/^[a-zA-Z]+[a-zA-Z0-9\s-]*$/.test(name) === false) return new ValidationError('Invalid name format. The name must consist of letters, numbers, spaces and lines, must start with a letter'); 
    return new ValidationSuccess();
};

const validateProductTypeFieldName = async (name) => {
    return await validator(name, [], [validateProductTypeFieldNameIsString, validateProductTypeFieldNameIsCorrectLength, validateProductTypeFieldNameIsCorrectFormat], validateProductTypeFieldNameIsProvided);
};

export default validateProductTypeFieldName;