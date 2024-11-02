import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../default-validators";
import { ValidationError, ValidationSuccess } from "../validation-result";

import validator from '../validator';

const validateNameIsProvided = (name, verboseName) => {
    return validateIsProvided(name, verboseName);
};

const validateNameIsString = (name, verboseName) => {
    return validateIsCorrectType(name, verboseName, 'string');
};

const validateNameIsCorrectLength = (name, verboseName) => {
    return validateIsCorrectLength(name, verboseName, 2, 50);
};

const validateNameConsistsOfLetters = (name, verboseName) => {
    if(/^[a-zA-Z]+$/.test(name) === false) return new ValidationError(`${verboseName} must only contain letters`);
    return new ValidationSuccess();
};

const validateName = async (name, verboseName) => {
    return await validator(name, [verboseName], [validateNameIsString, validateNameIsCorrectLength, validateNameConsistsOfLetters], validateNameIsProvided);
};

export default validateName