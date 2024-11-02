import { validateIsProvided, validateIsCorrectType } from "../../default-validators";

import validator from '../../validator';

const validatePublishedIsProvided = (published) => {
    return validateIsProvided(published, 'published');
};

const validatePublishedIsBoolean = (published) => {
    return validateIsCorrectType(published, 'published', 'boolean');
};

const validatePublished = async (published) => {
    return await validator(published, [], [validatePublishedIsBoolean], validatePublishedIsProvided);
};

const validatePublishedGet = async (published) => {
    return await validator(published, [], [validatePublishedIsBoolean], validatePublishedIsProvided, false);
};

export default {
    validatePublished,
    validatePublishedGet
};