const { validateIsProvided, validateIsCorrectType, validateIsCorrectValue } = require("../../default-validators")

const validator = require('../../validator');

const validateBannerSortIsProvided = (sort) => {
    return validateIsProvided(sort, 'sortBy');
};

const validateBannerSortIsString = (sort) => {
    return validateIsCorrectType(sort, 'sortBy', 'string');
};

const validateBannerSortContainsCorrectValue = (sort) => {
    return validateIsCorrectValue(sort, 'sortBy', ['activeTillASC', 'activeTillDESC', 'headerASC', 'headerDESC', 'newest', 'oldest']);
};

const validateBannerSort = async (sort) => {
    return await validator(sort, [], [validateBannerSortIsString, validateBannerSortContainsCorrectValue], validateBannerSortIsProvided);
};

module.exports = validateBannerSort