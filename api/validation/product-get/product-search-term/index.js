const { validateIsProvided, validateIsCorrectType } = require("../../default-validators");
const { validateProductName } = require("../../product/product-name");
const { validateProductSKU } = require("../../product/product-sku");

const validator = require('../../validator');

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

module.exports = validateProductSearchTerm;