const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateUserSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateUserSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateUserSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['firstNameASC', 'firstNameDESC', 'lastNameASC', 'lastNameDESC', 'usernameASC', 'usernameDESC', 'newest', 'oldest']);
};

const validateUserSort = async (sort) => {
    return await validator(sort, [], [validateUserSortIsString, validateUserSortContainsCorrectValue], validateUserSortIsProvided);
};

module.exports = validateUserSort