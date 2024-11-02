const { validateIsArray, validateIsProvided } = require("../../default-validators");
const validateID = require("../../id");
const { ValidationSuccess, ValidationError } = require("../../validation-result");

const validator = require('../../validator');

const validateBlogOwnersIsProvided = (owners) => {
    return validateIsProvided(owners, 'owners');
};

const validateBlogOwnersIsArray = (owners) => {
    return validateIsArray(owners, 'owners');
};

const validateBlogOwnersIsValid = async (owners, id) => {
    if(owners.length === 0) return new ValidationSuccess();
    if(owners.length > 5) return new ValidationError('owners must be no longer than 5');
    for(let i = 0; i < owners.length; i++) {
        if(owners[i] === 'My Blogs') {owners[i] = id};
        const result = await validateID(owners[i]);
        if(!result.success) return new ValidationError('owners must contain valid owners');
        owners[i] = result.data;
    };

    return new ValidationSuccess(owners);
};

const validateBlogOwners = async (owners, id) => {
    return await validator(owners, [id], [validateBlogOwnersIsArray, validateBlogOwnersIsValid], validateBlogOwnersIsProvided, false);
};

module.exports = validateBlogOwners;