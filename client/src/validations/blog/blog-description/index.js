import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from '../../default-validators';

import validator from '../../validator';

const validateDescriptionIsProvided = (description) => {
    return validateIsProvided(description, 'description');
};

const validateDescriptionIsString = (description) => {
    return validateIsCorrectType(description, 'description', 'string');
};

const validateDescriptionIsCorrectLength = (description) => {
    return validateIsCorrectLength(description, 'description', 2, 300);
};

const validateDescription = async (description) => {
    return await validator(description, [], [validateDescriptionIsString, validateDescriptionIsCorrectLength], validateDescriptionIsProvided);
};

export default {
    validateDescription
};