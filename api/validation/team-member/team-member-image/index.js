const { validateIsProvided, validateImageIsCorrectRatio } = require("../../default-validators")

const validator = require('../../validator');

const validateTeamMemberImageIsProvided = (imageBuffer) => {
    return validateIsProvided(imageBuffer, 'image');
};

const validateTeamMemberImageIsCorrectRatio = async (imageBuffer) => {
    return await validateImageIsCorrectRatio(imageBuffer, 'image', 1);
};

const validateTeamMemberImage = async (imageBuffer, provided=true) => {
    return await validator(imageBuffer, [], [validateTeamMemberImageIsCorrectRatio], validateTeamMemberImageIsProvided, provided);
};

module.exports = validateTeamMemberImage