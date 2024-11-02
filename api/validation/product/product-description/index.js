const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");

const validator = require('../../validator');

const validateProductDescriptionIsProvided = (description) => {
    return validateIsProvided(description, 'description');
};

const validateProductDescriptionIsString = (description) => {
    return validateIsCorrectType(description, 'description', 'string');
};

const validateProductDescriptionIsCorrectLength = (description) => {
    return validateIsCorrectLength(description, 'description', 2, 1000);
};

const validateProductDescription = async (description) => {
    return await validator(description, [], [validateProductDescriptionIsString, validateProductDescriptionIsCorrectLength], validateProductDescriptionIsProvided);
};

module.exports = validateProductDescription