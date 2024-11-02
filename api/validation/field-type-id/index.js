const validateID = require('../id');
const { ValidationError, ValidationSuccess } = require("../validation-result");

const validator = require('../validator');

const validateFieldTypeIDIsID = async (id) => {
    return await validateID(id);  
};

const validateFieldTypeIDIsValid = async (id) => {
    if(id < 1 || id > 4) return new ValidationError('id must be one of 1, 2 or 3');
    return new ValidationSuccess();
};

const validateFieldTypeID = async (id) => {
    return await validator(id, [], [validateFieldTypeIDIsValid], validateFieldTypeIDIsID);
};

module.exports = validateFieldTypeID;