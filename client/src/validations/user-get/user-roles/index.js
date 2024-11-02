import { validateIsArray, validateIsProvided, validateIsCorrectType } from "../../default-validators";
import { ValidationSuccess, ValidationError } from "../../validation-result";

import validator from '../../validator';

const validateUserRolesIsProvided = (roles) => {
    return validateIsProvided(roles, 'roles');
};

const validateUserRolesIsArray = (roles) => {
    return validateIsArray(roles, 'roles');
};

const validateUserRolesIsValid = (roles) => {
    if(roles.length === 0) return new ValidationSuccess();
    for(let i = 0; i < roles.length; i++) {
        const result = validateIsCorrectType(roles[i], 'roles', 'number');
        if(!result.success) return new ValidationError('roles must contain valid roles');
        roles[i] = result.data;
        if(roles[i] < 1 || roles[i] > 3) return new ValidationError('roles must contain valid roles');
    };

    return new ValidationSuccess(roles);
};

const validateUserRoles = async (roles) => {
    return await validator(roles, [], [validateUserRolesIsArray, validateUserRolesIsValid], validateUserRolesIsProvided, false);
};

export default validateUserRoles;