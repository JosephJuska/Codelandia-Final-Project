import { validateIsCorrectType, validateIsCorrectLength, validateIsProvided } from "../../default-validators";

import validator from '../../validator';

const validateSubDescriptionIsProvided = (subDescription) => {
    return validateIsProvided(subDescription);
}

const validateSubDescriptionIsString = (subDescription) => {
    return validateIsCorrectType(subDescription, 'subDescription', 'string');
};

const validateSubDescriptionIsCorrectLength = (subDescription) => {
    return validateIsCorrectLength(subDescription, 'subDescription', null, 300);
};

const validateSubDescription = async (subDescription) => {
    return await validator(subDescription, [], [validateSubDescriptionIsString, validateSubDescriptionIsCorrectLength], validateSubDescriptionIsProvided, false);
};

export default {
    validateSubDescription
};