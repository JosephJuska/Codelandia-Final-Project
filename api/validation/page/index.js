const { validateIsProvided, validateIsCorrectType, validateIsInteger, validateIsBiggerThanZero } = require("../default-validators")

const validator = require('../validator');

const validatePageIsProvided = (page) => {
    return validateIsProvided(page, 'page');
};

const validatePageIsNumber = (page) => {
    return validateIsCorrectType(page, 'page', 'number');
};

const validatePageIsInteger = (page) => {
    return validateIsInteger(page, 'page');
};

const validatePageIsBiggerThanZero = (page) => {
    return validateIsBiggerThanZero(page, 'page');
};

const validatePage = async (page) => {
    return await validator(page, [], [validatePageIsNumber, validatePageIsInteger, validatePageIsBiggerThanZero], validatePageIsProvided, false);
};

module.exports = validatePage