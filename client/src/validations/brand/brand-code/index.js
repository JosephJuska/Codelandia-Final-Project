import { validateIsProvided, validateIsCorrectType, validateIsInteger, validateIsInRange } from "../../default-validators";

import validator from '../../validator';

const validateBrandCodeIsProvided = (code) => {
    return validateIsProvided(code, 'code');
};

const validateBrandCodeIsNumber = (code) => {
    return validateIsCorrectType(code, 'code', 'number');
};

const validateBrandCodeIsInteger = (code) => {
    return validateIsInteger(code, 'code');
};

const validateBrandCodeIsInRange = (code) => {
    return validateIsInRange(code, 'code', 10000, 99999);
};

const validateBrandCode = async (code, provided = true) => {
    return await validator(code, [], [validateBrandCodeIsNumber, validateBrandCodeIsInteger, validateBrandCodeIsInRange], validateBrandCodeIsProvided, provided);
};

export default validateBrandCode;