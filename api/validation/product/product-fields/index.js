const { FIELD_TYPES } = require('../../../utils/constants');
const { validateIsProvided, validateIsArray, validateIsCorrectType } = require('../../default-validators');
const { ValidationError, ValidationSuccess } = require('../../validation-result');

const validator = require('../../validator');

// ProductFields Validation (field in json)

const validateProductFieldsIsProvided = (fields) => {
    return validateIsProvided(fields, 'fields');
};

const validateProductFieldsIsArray = (fields) => {
    return validateIsArray(fields, 'fields');
};

const validateProductFieldsFirstCheck = async (fields) => {
    return await validator(fields, [], [validateProductFieldsIsArray], validateProductFieldsIsProvided);
};

// Product field value validation

const validateProductFieldValueIsProvided = (value) => {
    return validateIsProvided(value, 'value');
};

const validateProductValueIsCorrectType = (value, fieldTypeID) => {
    let type;
    switch(fieldTypeID){
        case FIELD_TYPES.FIELD_TYPE_STRING:
            type = 'string';
            break;
        case FIELD_TYPES.FIELD_TYPE_BOOLEAN:
            type = 'boolean';
            break;
        case FIELD_TYPES.FIELD_TYPE_NUMBER:
            type = 'number';
            break;
        default:
            type = 'string';
    };

    return validateIsCorrectType(value, 'value', type);
};

const validateProductFieldValue = async (value, fieldTypeID) => {
    return await validator(value, [fieldTypeID], [validateProductValueIsCorrectType], validateProductFieldValueIsProvided);
};

// Product fields validation (itself) 

const validateProductFieldsAreProvided = (fields, productTypeFields) => {
    if(fields.length !== productTypeFields.length) return new ValidationError('All fields must be provided');
    return new ValidationSuccess();
};

const validateProductFields = async (fields, productTypeFields) => {
    const validationResult = await validateProductFieldsAreProvided(fields, productTypeFields);
    if(!validationResult.success) return new ValidationError('All fields must be provided');

    let errors = {};
    let data = {};

    for(let i = 0; i < fields.length; i++) {
        let value = fields[i];
        const productTypeField = productTypeFields[i];
        const fieldTypeID = productTypeField.fieldTypeID;

        const validationResult = await validateProductFieldValue(value, fieldTypeID);
        if(!validationResult.success) errors['field' + (i+1)] = validationResult.error;
        else {
            value = value === null ? value : String(value);
            data['field' + (i + 1)] = { value: validationResult.data, productTypeFieldID: productTypeField.id };
        }
    };

    if(Object.keys(errors).length > 0) return new ValidationError({ fields: errors });
    return new ValidationSuccess(Object.values(data));
};

module.exports = {
    validateProductFieldsFirstCheck,
    validateProductFields
};