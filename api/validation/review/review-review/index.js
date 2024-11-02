const { validateIsProvided, validateIsCorrectType, validateIsInRange } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateReviewReviewIsProvided = (review) => {
    return validateIsProvided(review, 'review');
};

const validateReviewReviewIsNumber = (review) => {
    return validateIsCorrectType(review, 'review', 'number');
};

const validateReviewReviewIsCorrectFormat = (review) => {
    const parsedReview = String(review);
    if(/^[0-9](.[5]{1})?$/.test(parsedReview) === false) return new ValidationError('review must be a number with single decimal place of digit 5 like 1.5');
    return new ValidationSuccess();
};

const validateReviewReviewIsInRange = (review) => {
    return validateIsInRange(review, 'review', 1, 5);
};

const validateReviewReview = async (review) => {
    return await validator(review, [], [validateReviewReviewIsNumber, validateReviewReviewIsCorrectFormat, validateReviewReviewIsInRange], validateReviewReviewIsProvided);
};

module.exports = validateReviewReview