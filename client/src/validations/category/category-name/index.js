import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";
import { ValidationError, ValidationSuccess } from "../../validation-result";

import validator from '../../validator';

const validateCategoryNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateCategoryNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateCategoryNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 2, 50);
};

const validateCategoryNameIsCorrectFormat = (name) => {
    if(/^[A-Za-z\s]+$/.test(name) === false) return new ValidationError('name must only contain letters and spaces');
    return new ValidationSuccess();
};

const validateCategoryName = async (name) => {
    return await validator(name, [], [validateCategoryNameIsString, validateCategoryNameIsCorrectLength, validateCategoryNameIsCorrectFormat], validateCategoryNameIsProvided);
};

export default validateCategoryName;
