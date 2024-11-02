const { validateIsProvided, validateIsCorrectType, validateIsBiggerThanZero } = require("../default-validators");

const validator = require('../validator');

const validateOffsetIsProvided = (offset) => {
    return validateIsProvided(offset, 'offset');
};

const validateOffsetIsNumber = (offset) => {
    return validateIsCorrectType(offset, 'offset', 'number');
};

const validateOffsetIsGreaterThanZero = (offset) => {
    return validateIsBiggerThanZero(offset, 'offset');
};

const validateOffset = async (offset) => {
    return await validator(offset, [], [validateOffsetIsNumber, validateOffsetIsGreaterThanZero], validateOffsetIsProvided);
};

module.exports = validateOffset