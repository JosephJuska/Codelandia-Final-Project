const { validateIsProvided } = require("../../default-validators");
const { validateEmail } = require("../../email");
const { validateName } = require("../../user-name");
const { validateUsername } = require("../../username");

const validator = require('../../validator');

const validateUserSearchTermIsProvided = (searchTerm) => {
    return validateIsProvided(searchTerm, 'searchTerm');
};

const validateUserSearchTermIsValid = async (searchTerm) => {
    let result;
    if(searchTerm.includes('@')) result = await validateEmail(searchTerm);
    else if(/[0-9_]/.test(searchTerm) === true) result = await validateUsername(searchTerm);
    else result = await validateName(searchTerm, 'name');

    return result;
};

const validateUserSearchTerm = async (searchTerm) => {
    return await validator(searchTerm, [], [validateUserSearchTermIsValid], validateUserSearchTermIsProvided, false);
};

module.exports = validateUserSearchTerm;