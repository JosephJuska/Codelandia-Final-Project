import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";

import validator from '../../validator';

const validateBrandNameIsProvided = (name) => {
    return validateIsProvided(name, 'name');
};

const validateBrandNameIsString = (name) => {
    return validateIsCorrectType(name, 'name', 'string');
};

const validateBrandNameIsCorrectLength = (name) => {
    return validateIsCorrectLength(name, 'name', 1, 100);
};

const validateBrandName = async (name, provided = true) => {
    return await validator(name, [], [validateBrandNameIsString, validateBrandNameIsCorrectLength], validateBrandNameIsProvided, provided);
};

export default validateBrandName;