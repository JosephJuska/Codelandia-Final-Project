import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from '../../default-validators';

import validator from '../../validator';

const validateTitleIsProvided = (title) => {
    return validateIsProvided(title, 'title');
};

const validateTitleIsString = (title) => {
    return validateIsCorrectType(title, 'title', 'string');
};

const validateTitleIsCorrectLength = (title) => {
    return validateIsCorrectLength(title, 'title', 2, 150);
};

const validateTitle = async (title) => {
    return await validator(title, [], [validateTitleIsString, validateTitleIsCorrectLength], validateTitleIsProvided);
};

const validateTitleGet = async (title) => {
    return await validator(title, [], [validateTitleIsString, validateTitleIsCorrectLength], validateTitleIsProvided, false);
};

export default {
    validateTitle,
    validateTitleGet
}