import { validateIsArray, validateIsProvided } from "../default-validators";
import validateID from "../id";
import { ValidationSuccess, ValidationError } from "../validation-result";

import validator from '../validator';

const validateBlogOwnersIsProvided = (owners) => {
    return validateIsProvided(owners, 'owners');
};

const validateBlogOwnersIsArray = (owners) => {
    return validateIsArray(owners, 'owners');
};

const validateBlogOwnersIsValid = async (owners) => {
    if(owners.length === 0) return new ValidationSuccess();
    if(owners.length > 5) return new ValidationError('owners must be no longer than 5');
    for(let i = 0; i < owners.length; i++) {
        if(owners[i] === 'My Blogs') continue; 
        const result = await validateID(owners[i]);
        if(!result.success) return new ValidationError('owners must contain valid owners');
        owners[i] = result.data;
    };

    return new ValidationSuccess(owners);
};

const validateBlogOwners = async (owners) => {
    return await validator(owners, [], [validateBlogOwnersIsArray, validateBlogOwnersIsValid], validateBlogOwnersIsProvided, false);
};

export default validateBlogOwners;