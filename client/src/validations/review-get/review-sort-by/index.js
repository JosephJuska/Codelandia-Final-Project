import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators";

import validator from '../../validator';

const validateReviewSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateReviewSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateReviewSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'ratingASC', 'ratingDESC']);
};

const validateReviewSort = async (sort) => {
    return await validator(sort, [], [validateReviewSortIsString, validateReviewSortContainsCorrectValue], validateReviewSortIsProvided);
};

export default validateReviewSort;