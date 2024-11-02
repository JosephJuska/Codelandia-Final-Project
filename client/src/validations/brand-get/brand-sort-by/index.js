import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators";

import validator from '../../validator';

const validateBrandSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateBrandSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateBrandSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['nameASC', 'nameDESC', 'codeASC', 'codeDESC']);
};

const validateBrandSort = async (sort) => {
    return await validator(sort, [], [validateBrandSortIsString, validateBrandSortContainsCorrectValue], validateBrandSortIsProvided);
};

export default {
    validateBrandSort
};