import { validateIsProvided, validateIsCorrectType, validateIsDate } from '../../default-validators';

import validator from '../../validator';

const validateDiscountDateIsProvided = (date, valueName) => {
    return validateIsProvided(date, valueName);
};

const validateDiscountDateIsString = (date, valueName) => {
    return validateIsCorrectType(date, valueName, 'string');
};

const validateDiscountDateIsValidDate = (date, valueName) => {
    return validateIsDate(date, valueName);
};

const validateDiscountDate = async (date, valueName, provided = true) => {
    return validator(date, [valueName], [validateDiscountDateIsString, validateDiscountDateIsValidDate], validateDiscountDateIsProvided, provided);
};

export default validateDiscountDate;