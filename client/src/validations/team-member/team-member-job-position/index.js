import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";
import { ValidationError, ValidationSuccess } from "../../validation-result";

import validator from '../../validator';

const validateTeamMemberJobPositionIsProvided = (jobPosition) => {
    return validateIsProvided(jobPosition, 'jobPosition');
};

const validateTeamMemberJobPositionIsString = (jobPosition) => {
    return validateIsCorrectType(jobPosition, 'jobPosition', 'string');
};

const validateTeamMemberJobPositionIsCorrectLength = (jobPosition) => {
    return validateIsCorrectLength(jobPosition, 'jobPosition', 2, 50);
};

const validateTeamMemberJobPositionIsCorrectFormat = (jobPosition) => {
    if(/[a-zA-Z\s]/.test(jobPosition) === false) return new ValidationError('jobPosition must only contain letters and spaces');
    return new ValidationSuccess();
};

const validateTeamMemberJobPosition = async (jobPosition) => {
    return await validator(jobPosition, [], [validateTeamMemberJobPositionIsString, validateTeamMemberJobPositionIsCorrectLength, validateTeamMemberJobPositionIsCorrectFormat], validateTeamMemberJobPositionIsProvided);
};

export default validateTeamMemberJobPosition;