import { validateIsProvided, validateIsCorrectType } from "../../default-validators";
import validateProductName from "../../product/product-name";
import validateProductSKU from "../../product/product-sku";

import validator from '../../validator';

const validateProductSearchTermIsProvided = (searchTerm) => {
    return validateIsProvided(searchTerm, 'searchTerm');
};

const validateProductSearchTermIsValid = async (searchTerm) => {
    let result;
    const digitResult = validateIsCorrectType(searchTerm, 'searchTerm', 'number');
    if(!digitResult.success) result = await validateProductName(searchTerm);
    else result = await validateProductSKU(searchTerm);

    return result;
};

const validateProductSearchTerm = async (searchTerm) => {
    return await validator(searchTerm, [], [validateProductSearchTermIsValid], validateProductSearchTermIsProvided, false);
};

export default validateProductSearchTerm;