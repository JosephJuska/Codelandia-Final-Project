import FIELD_TYPES from '../../../utils/constants/field-types';
import { validateIsProvided, validateIsCorrectType } from '../../default-validators';

import validator from '../../validator';

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

export default validateProductFieldValue;