import { validateIsProvided, validateIsCorrectType } from "../../default-validators";

import validator from '../../validator';

const validateContentIsProvided = (content) => {
    return validateIsProvided(content, 'content');
};

const validateContentIsString = (content) => {
    return validateIsCorrectType(content, 'content', 'string');
};

const validateContent = async (content) => {
    return await validator(content, [], [validateContentIsString], validateContentIsProvided, false);
};

export default {
    validateContent
};