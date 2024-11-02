import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";

import validator from '../../validator';

const validateProductNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateProductNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateProductNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 2, 200);
};

const validateProductName = async (name) => {
    return validator(name, [], [validateProductNameIsString, validateProductNameIsCorrectLength], validateProductNameIsProvided);
};

export default validateProductName;