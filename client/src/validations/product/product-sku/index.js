import { validateIsProvided, validateIsCorrectType, validateIsInteger, validateIsInRange } from "../../default-validators";

import validator from '../../validator';

const validateProductSKUIsProvided = (sku) => {
    return validateIsProvided(sku, 'sku');
};

const validateProductSKUIsNumber = (sku) => {
    return validateIsCorrectType(sku, 'sku', 'number');
};

const validateProductSKUIsInteger = (sku) => {
    return validateIsInteger(sku, 'sku');
};

const validateProductSKUIsInRange = (sku) => {
    return validateIsInRange(sku, 'sku', 10000000, 99999999);
};

const validateProductSKU = async (sku) => {
    return await validator(sku, [], [validateProductSKUIsNumber, validateProductSKUIsInteger, validateProductSKUIsInRange], validateProductSKUIsProvided);
};

export default validateProductSKU;