import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../default-validators";
import { ValidationError, ValidationSuccess } from "../validation-result";

import validator from '../validator';

const validateProductTypeNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateProductTypeNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateProductTypeNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 2, 50);
};

const validateProductTypeNameIsCorrectFormat = (name) => {
    if(/^[a-zA-Z\s]*$/.test(name) === false) return new ValidationError('Invalid name format. The name must consist of letters and spaces');
    return new ValidationSuccess();
};

const validateProductTypeName = async (name, provided=true) => {
    return await validator(name, [], [validateProductTypeNameIsString, validateProductTypeNameIsCorrectLength, validateProductTypeNameIsCorrectFormat], validateProductTypeNameIsProvided, provided);
};

export default validateProductTypeName;