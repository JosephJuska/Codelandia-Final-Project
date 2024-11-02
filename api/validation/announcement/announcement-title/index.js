const { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } = require("../../default-validators")

const validator = require('../../validator');

const validateAnnouncementTitleIsProvided = (title) => {
    return validateIsProvided(title, 'title');
};

const validateAnnouncementTitleIsString = (title) => {
    return validateIsCorrectType(title, 'title', 'string');
};  

const validateAnnouncementTitleIsCorrectLength = (title) => {
    return validateIsCorrectLength(title, 'title', 2, 100);  
};

const validateAnnouncementTitle = async (title, provided = true) => {
    return await validator(title, [], [validateAnnouncementTitleIsString, validateAnnouncementTitleIsCorrectLength], validateAnnouncementTitleIsProvided, provided);
};

module.exports = validateAnnouncementTitle