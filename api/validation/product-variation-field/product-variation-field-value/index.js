const { FIELD_TYPES } = require("../../../utils/constants");
const { validateIsProvided, validateIsCorrectType } = require("../../default-validators");
const { ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateProductVariationFieldIsProvided = (value) => {
    return validateIsProvided(value, 'value');
};

const validateProductVariationFieldIsCorrectType = async (value, fieldTypeID) => {
    let type;
    switch(fieldTypeID){
        case FIELD_TYPES.FIELD_TYPE_NUMBER:
            type = 'number';
            break;
        case FIELD_TYPES.FIELD_TYPE_STRING:
            type = "string";
            break;
        case FIELD_TYPES.FIELD_TYPE_BOOLEAN:
            type = 'boolean';
            break;
        default:
            type = 'string';
    };

    const result = await validateIsCorrectType(value, 'value', type);
    if(!result.success) return result;
    return new ValidationSuccess(String(result.data));
};

const validateProductVariationFieldValuePrimary = async (value) => {
    return await validator(value, [], [], validateProductVariationFieldIsProvided);
};

const validateProductVariationFieldValue = async (value, fieldTypeID) => {
    return await validator(value, [fieldTypeID], [validateProductVariationFieldIsCorrectType], validateProductVariationFieldIsProvided);
};

module.exports = {
    validateProductVariationFieldValuePrimary,
    validateProductVariationFieldValue
};