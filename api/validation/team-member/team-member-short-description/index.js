const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateTeamMemberShortDescriptionIsProvided = (shortDescription) => {
    return validateIsProvided(shortDescription, 'shortDescription');
};

const validateTeamMemberShortDescriptionIsString = (shortDescription) => {
    return validateIsCorrectType(shortDescription, 'shortDescription', 'string');
};

const validateTeamMemberShortDescriptionIsCorrectLength = (shortDescription) => {
    return validateIsCorrectLength(shortDescription, 'shortDescription', 2, 100);
};

const validateTeamMemberShortDescription = async (shortDescription) => {
    return await validator(shortDescription, [], [validateTeamMemberShortDescriptionIsString, validateTeamMemberShortDescriptionIsCorrectLength], validateTeamMemberShortDescriptionIsProvided);
};

module.exports = validateTeamMemberShortDescription