import { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } from "../../default-validators";

import validator from '../../validator';

const validateDiscountSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateDiscountSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateDiscountSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'percentageASC', 'percentageDESC']);
};

const validateDiscountSort = async (sort) => {
    return await validator(sort, [], [validateDiscountSortIsString, validateDiscountSortContainsCorrectValue], validateDiscountSortIsProvided);
};

export default validateDiscountSort;