const { validateIsArray, validateIsProvided } = require("../../default-validators");
const { validateID } = require("../../id");
const { ValidationSuccess, ValidationError } = require("../../validation-result");

const validator = require('../../validator');

const validateUserRolesIsProvided = (roles) => {
    return validateIsProvided(roles, 'roles');
};

const validateUserRolesIsArray = (roles) => {
    return validateIsArray(roles, 'roles');
};

const validateUserRolesIsValid = async (roles) => {
    if(roles.length === 0) return new ValidationSuccess();
    for(let i = 0; i < roles.length; i++) {
        const result = await validateID(roles[i]);
        if(!result.success) return new ValidationError('roles must contain valid roles');
        roles[i] = result.data;
        if(roles[i] < 1 || roles[i] > 3) return new ValidationError('roles must contain valid roles');
    };

    return new ValidationSuccess(roles);
};

const validateUserRoles = async (roles) => {
    return await validator(roles, [], [validateUserRolesIsArray, validateUserRolesIsValid], validateUserRolesIsProvided, false);
};

module.exports = validateUserRoles;