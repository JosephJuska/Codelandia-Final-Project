import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";

import validator from '../../validator';

const validateReviewDescriptionIsProvided = (description) => {
    return validateIsProvided(description, 'description');
};

const validateReviewDescriptionIsString = (description) => {
    return validateIsCorrectType(description, 'description', 'string');
};

const validateReviewDescriptionIsCorrectLength = (description) => {
    return validateIsCorrectLength(description, 'description', 2, 500);
};

const validateReviewDescription = async (description) => {
    return await validator(description, [], [validateReviewDescriptionIsString, validateReviewDescriptionIsCorrectLength], validateReviewDescriptionIsProvided);
};

export default validateReviewDescription;