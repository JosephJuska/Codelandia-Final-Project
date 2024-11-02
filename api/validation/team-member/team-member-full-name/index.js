const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

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

module.exports = validateTeamMemberFullName