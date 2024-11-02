const validateID = require("../id");
const { validateProductVariationFieldValuePrimary } = require("./product-variation-field-value");

const validateProductVariationField = (productVariationID, productTypeFieldID, value) => {
    return {
        productTypeFieldID: [productTypeFieldID, validateID],
        productVariationID: [productVariationID, validateID],
        value: [value, validateProductVariationFieldValuePrimary]
    };
};

const validateProductVariationFieldUpdate = (productTypeFieldID, value) => {
    return {
        productTypeFieldID: [productTypeFieldID, validateID],
        value: [value, validateProductVariationFieldValuePrimary]
    };
};

module.exports = {
    validateProductVariationField,
    validateProductVariationFieldUpdate
};