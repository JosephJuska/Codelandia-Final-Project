import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators"

import validator from '../../validator';

const validateBlogSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateBlogSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateBlogSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'titleASC', 'titleDESC']);
};

const validateBlogSort = async (sort) => {
    return await validator(sort, [], [validateBlogSortIsString, validateBlogSortContainsCorrectValue], validateBlogSortIsProvided);
};

export default validateBlogSort;