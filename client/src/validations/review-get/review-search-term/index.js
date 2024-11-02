import { validateIsProvided } from "../../default-validators";
import validateEmail from "../../email";
import validateName from "../../user-name";

import validator from '../../validator';

const validateReviewSearchTermIsProvided = (searchTerm) => {
    return validateIsProvided(searchTerm, 'searchTerm');
};

const validateReviewSearchTermIsValid = async (searchTerm) => {
    let result;
    if(searchTerm.includes('@')) result = await validateEmail(searchTerm);
    else result = await validateName(searchTerm, 'searchTerm');

    return result;
};

const validateReviewSearchTerm = async (searchTerm) => {
    return await validator(searchTerm, [], [validateReviewSearchTermIsValid], validateReviewSearchTermIsProvided, false);
};

export default validateReviewSearchTerm;