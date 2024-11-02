import { validateIsProvided } from "../../default-validators";
import validateEmail from "../../email";
import validateName from "../../user-name";

import validator from '../../validator';

const validateCommentSearchTermIsProvided = (searchTerm) => {
    return validateIsProvided(searchTerm, 'searchTerm');
};

const validateCommentSearchTermIsValid = async (searchTerm) => {
    let result;
    if(searchTerm.includes('@')) result = await validateEmail(searchTerm);
    else result = await validateName(searchTerm, 'searchTerm');

    return result;
};

const validateCommentSearchTerm = async (searchTerm) => {
    return await validator(searchTerm, [], [validateCommentSearchTermIsValid], validateCommentSearchTermIsProvided, false);
};

export default validateCommentSearchTerm;