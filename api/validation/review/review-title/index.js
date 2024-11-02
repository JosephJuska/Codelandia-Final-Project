const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators");

const validator = require('../../validator');

const validateReviewTitleIsProvided = (title) => {
    return validateIsProvided(title, 'title');
};

const validateReviewTitleIsString = (title) => {
    return validateIsCorrectType(title, 'title', 'string');
};

const validateReviewTitleIsCorrectLength = (title) => {
    return validateIsCorrectLength(title, 'title', 2, 100);
};

const validateReviewTitle = async (title) => {
    return await validator(title, [], [validateReviewTitleIsString, validateReviewTitleIsCorrectLength], validateReviewTitleIsProvided);
};

module.exports = validateReviewTitle