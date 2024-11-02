import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../default-validators";
import { validate as emailFormatValidator } from "email-validator";
import { ValidationError, ValidationSuccess } from "../validation-result";

import validator from "../validator";

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
    const result = emailFormatValidator(email);
    if(!result) return new ValidationError('email format is incorrect');
    return new ValidationSuccess();
}

const validateEmail = async (email) => {
    return await validator(email, [], [validateEmailIsString, validateEmailIsCorrectLength, validateEmailFormatIsCorrect], validateEmailIsProvided);
};

export default validateEmail;