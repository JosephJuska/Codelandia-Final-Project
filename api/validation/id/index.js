const { validateIsProvided, validateIsCorrectType, validateIsPositive, validateIsInteger } = require("../default-validators");

const validator = require('../validator');

const validateIDIsProvided = (id) => {
    return validateIsProvided(id, 'id');
};

const validateIDIsNumber = (id) => {
    return validateIsCorrectType(id, 'id', 'number');
};

const validateIDIsPositive = (id) => {
    return validateIsPositive(id, 'id');
};

const validateIDIsNotPointer = (id) => {
    return validateIsInteger(id, 'id');
};

const validateID = async (id, provided = true) => {
    return await validator(id, [], [validateIDIsNumber, validateIDIsNotPointer, validateIDIsPositive], validateIDIsProvided, provided);
};

module.exports = validateID;