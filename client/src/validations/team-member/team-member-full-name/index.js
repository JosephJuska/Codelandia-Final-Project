import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";
import { ValidationError, ValidationSuccess } from "../../validation-result";

import validator from '../../validator';

const validateTeamMemberFullNameIsProvided = (fullName) => {
    return validateIsProvided(fullName, 'fullName');
};

const validateTeamMemberFullNameIsString = (fullName) => {
    return validateIsCorrectType(fullName, 'fullName', 'string');
};

const validateTeamMemberFullNameIsCorrectLength = (fullName) => {
    return validateIsCorrectLength(fullName, 'fullName', 2, 100);
};

const validateTeamMemberFullNameIsCorrectFormat = (fullName) => {
    if(/[a-zA-Z\s]/.test(fullName) === false) return new ValidationError('fullName must only contain letters and spaces');
    return new ValidationSuccess();
};

const validateTeamMemberFullName = async (fullName) => {
    return await validator(fullName, [], [validateTeamMemberFullNameIsString, validateTeamMemberFullNameIsCorrectLength, validateTeamMemberFullNameIsCorrectFormat], validateTeamMemberFullNameIsProvided);
};

export default validateTeamMemberFullName;