const { validateIsProvided, validateIsCorrectType, validateIsPositive } = require("../default-validators");

const validator = require('../validator');

const validateLimitIsProvided = (limit) => {
    return validateIsProvided(limit, 'limit');
};

const validateLimitIsNumber = (limit) => {
    return validateIsCorrectType(limit, 'limit', 'number');
};

const validateLimitIsPositive = (limit) => {
    return validateIsPositive(limit, 'limit');
};

const validateLimit = async (limit) => {
    return await validator(limit, [], [validateLimitIsNumber, validateLimitIsPositive], validateLimitIsProvided);
};

module.exports = validateLimit