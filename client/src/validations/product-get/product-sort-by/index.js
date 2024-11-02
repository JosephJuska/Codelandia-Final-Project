import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators";

import validator from '../../validator';

const validateProductSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateProductSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateProductSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'nameASC', 'nameDESC', 'priceASC', 'priceDESC']);
};

const validateProductSort = async (sort) => {
    return await validator(sort, [], [validateProductSortIsString, validateProductSortContainsCorrectValue], validateProductSortIsProvided);
};

export default validateProductSort;