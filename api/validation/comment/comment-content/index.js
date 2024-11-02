const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators")

const validator = require('../../validator');

const validateCommentContentIsProvided = (content) => {
    return validateIsProvided(content, 'content');
};

const validateCommentContentIsString = (content) => {
    return validateIsCorrectType(content, 'content', 'string');
};

const validateCommentContentIsCorrectLength = (content) => {
    return validateIsCorrectLength(content, 'content', null, 500);
};

const validateCommentContent = async (content) => {
    return await validator(content, [], [validateCommentContentIsString, validateCommentContentIsCorrectLength], validateCommentContentIsProvided);
};

module.exports = validateCommentContent