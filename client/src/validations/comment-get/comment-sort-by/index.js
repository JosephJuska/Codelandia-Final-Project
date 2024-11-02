import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators";

import validator from '../../validator';

const validateCommentSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateCommentSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateCommentSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['nameASC', 'nameDESC', 'newest', 'oldest']);
};

const validateCommentSort = async (sort) => {
    return await validator(sort, [], [validateCommentSortIsString, validateCommentSortContainsCorrectValue], validateCommentSortIsProvided);
};

export default validateCommentSort;