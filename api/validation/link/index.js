const { validateIsProvided, validateIsCorrectType } = require("../default-validators");
const { ValidationSuccess, ValidationError } = require("../validation-result");

const validator = require('../validator');

const validateLinkIsProvided = (link) => {
    return validateIsProvided(link, 'link');
};

const validateLinkIsString = (link) => {
    return validateIsCorrectType(link, 'link', 'string');
};

const validateLinkIsValid = (link) => {
    try{
        new URL(link);
        return new ValidationSuccess();
    }catch{
        return new ValidationError('link is invalid');
    }
};

const validateLink = async (link, provided = true) => {
    return validator(link, [], [validateLinkIsString, validateLinkIsValid], validateLinkIsProvided, provided);
};

module.exports = validateLink