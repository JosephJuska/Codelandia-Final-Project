const { validateIsProvided } = require("../../default-validators");
const { validateEmail } = require("../../email");
const { validateName } = require("../../user-name");

const validator = require('../../validator');

const validateReviewSearchTermIsProvided = (searchTerm) => {
    return validateIsProvided(searchTerm, 'searchTerm');
};

const validateReviewSearchTermIsValid = async (searchTerm) => {
    let result;
    if(searchTerm.includes('@')) result = await validateEmail(searchTerm);
    else result = await validateName(searchTerm, 'searchTerm');

    return result;
};

const validateReviewSearchTerm = async (searchTerm) => {
    return await validator(searchTerm, [], [validateReviewSearchTermIsValid], validateReviewSearchTermIsProvided, false);
};

module.exports = validateReviewSearchTerm;