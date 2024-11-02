import { validateIsProvided, validateIsCorrectType, validateIsPositive, validateIsInRange, validateIsInteger } from "../../default-validators";

import validator from '../../validator';

const validateDiscountPercentageIsProvided = (percentage, valueName) => {
    return validateIsProvided(percentage, valueName || 'discountPercentage');
};

const validateDiscountPercentageIsNumber = (percentage, valueName) => {
    return validateIsCorrectType(percentage, valueName || 'discountPercentage', 'number');
};

const validateDiscountPercentageIsInteger = (percentage, valueName) => {
    return validateIsInteger(percentage, valueName || 'percentage');
};

const validateDiscountPercentageIsPositive = (percentage, valueName) => {
    return validateIsPositive(percentage, valueName || 'discountPercentage');
};

const validateDiscountPercentageIsInRange = (percentage, valueName) => {
    return validateIsInRange(percentage, valueName || 'discountPercentage', 1, 100);
};

const validateDiscountPercentage = async (percentage, valueName) => {
    return await validator(percentage, valueName ? [valueName] : [], [validateDiscountPercentageIsNumber, validateDiscountPercentageIsInteger, validateDiscountPercentageIsPositive, validateDiscountPercentageIsInRange], validateDiscountPercentageIsProvided);
};

export default validateDiscountPercentage;