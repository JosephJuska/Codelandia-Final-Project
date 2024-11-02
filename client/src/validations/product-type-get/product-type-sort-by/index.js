import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators";

import validator from '../../validator';

const validateProductTypeSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateProductTypeSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateProductTypeSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['nameASC', 'nameDESC', 'productCountASC', 'productCountDESC']);
};

const validateProductTypeSort = async (sort) => {
    return await validator(sort, [], [validateProductTypeSortIsString, validateProductTypeSortContainsCorrectValue], validateProductTypeSortIsProvided);
};

export default validateProductTypeSort;