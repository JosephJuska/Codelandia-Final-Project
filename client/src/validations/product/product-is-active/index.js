import { validateIsProvided, validateIsCorrectType } from "../../default-validators";

import validator from '../../validator';

const validateProductIsActiveIsProvided = (isActive) => {
    return validateIsProvided(isActive, 'isActive');
};

const validateProductIsActiveIsBoolean = (isActive) => {
    return validateIsCorrectType(isActive, 'isActive', 'boolean');
};

const validateProductIsActive = async (isActive) => {
    return await validator(isActive, [], [validateProductIsActiveIsBoolean], validateProductIsActiveIsProvided);
};

export default validateProductIsActive;