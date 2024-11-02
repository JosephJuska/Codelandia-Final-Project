const { validateIsProvided } = require("../../default-validators");
const validateEmail = require("../../email");
const validateName = require("../../user-name");

const validator = require('../../validator');

const validateCommentSearchTermIsProvided = (searchTerm) => {
    return validateIsProvided(searchTerm, 'searchTerm');
};

const validateCommentSearchTermIsValid = async (searchTerm) => {
    let result;
    if(searchTerm.includes('@')) result = await validateEmail(searchTerm);
    else result = await validateName(searchTerm, 'searchTerm');

    return result;
};

const validateCommentSearchTerm = async (searchTerm) => {
    return await validator(searchTerm, [], [validateCommentSearchTermIsValid], validateCommentSearchTermIsProvided, false);
};

module.exports = validateCommentSearchTerm;