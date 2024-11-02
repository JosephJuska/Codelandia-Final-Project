const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateAnnouncementSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateAnnouncementSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateAnnouncementSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['newest', 'oldest', 'titleASC', 'titleDESC']);
};

const validateAnnouncementSort = async (sort) => {
    return await validator(sort, [], [validateAnnouncementSortIsString, validateAnnouncementSortContainsCorrectValue], validateAnnouncementSortIsProvided);
};

module.exports = validateAnnouncementSort