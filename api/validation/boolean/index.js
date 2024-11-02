const { validateIsProvided, validateIsCorrectType } = require("../default-validators")

const validator = require('../validator');

const validateBooleanIsProvided = (bool, valueName) => {
    return validateIsProvided(bool, valueName);
};

const validateBooleanIsBoolean = (bool, valueName) => {
    return validateIsCorrectType(bool, valueName, 'boolean');
};

const validateBoolean = async (bool, valueName, isProvided = true) => {
    return await validator(bool, [valueName], [validateBooleanIsBoolean], validateBooleanIsProvided, isProvided);
};

module.exports = validateBoolean