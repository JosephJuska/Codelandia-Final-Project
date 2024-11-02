const { validateIsProvided, validateIsCorrectType } = require("../../default-validators");

const validator = require('../../validator');

const validateProductIsActiveIsProvided = (isActive) => {
    return validateIsProvided(isActive, 'isActive');
};

const validateProductIsActiveIsBoolean = (isActive) => {
    return validateIsCorrectType(isActive, 'isActive', 'boolean');
};

const validateProductIsActive = async (isActive) => {
    return await validator(isActive, [], [validateProductIsActiveIsBoolean], validateProductIsActiveIsProvided);
};

module.exports = validateProductIsActive