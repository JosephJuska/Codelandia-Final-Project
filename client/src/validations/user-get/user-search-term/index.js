import { validateIsProvided } from "../../default-validators";
import validateEmail from "../../email";
import validateName from "../../user-name";
import validateUsername from "../../username";

import validator from '../../validator';

const validateUserSearchTermIsProvided = (searchTerm) => {
    return validateIsProvided(searchTerm, 'searchTerm');
};

const validateUserSearchTermIsValid = async (searchTerm) => {
    console.log('search term is:' + searchTerm);
    let result;
    if(searchTerm.includes('@')) result = await validateEmail(searchTerm);
    else if(/[0-9_]/.test(searchTerm) === true) result = await validateUsername(searchTerm);
    else result = await validateName(searchTerm, 'name');

    return result;
};

const validateUserSearchTerm = async (searchTerm) => {
    return await validator(searchTerm, [], [validateUserSearchTermIsValid], validateUserSearchTermIsProvided, false);
};

export default validateUserSearchTerm;