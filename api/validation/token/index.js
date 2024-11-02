const { validateIsProvided, validateIsCorrectType } = require("../default-validators")

const validator = require('../validator');

const validateTokenIsProvided = (token) => {
    return validateIsProvided(token, 'token');
};

const validateTokenIsString = (token) => {
    return validateIsCorrectType(token, 'token', 'string');
};

const validateToken = async (token) => {
    return await validator(token, [], [validateTokenIsString], validateTokenIsProvided);
};

module.exports = validateToken