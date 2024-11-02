import { validateIsProvided, validateImageIsCorrectRatio } from "../../default-validators";

import validator from '../../validator';

const validateTeamMemberImageIsProvided = (imageBuffer) => {
    return validateIsProvided(imageBuffer, 'image');
};

const validateTeamMemberImageIsCorrectRatio = async (imageBuffer) => {
    return await validateImageIsCorrectRatio(imageBuffer, 'image', 1, 1);
};

const validateTeamMemberImage = async (imageBuffer) => {
    return await validator(imageBuffer, [], [validateTeamMemberImageIsCorrectRatio], validateTeamMemberImageIsProvided);
};

const validateTeamMemberImageUpdate = async (imageBuffer) => {
    return await validator(imageBuffer, [], [validateTeamMemberImageIsCorrectRatio], validateTeamMemberImageIsProvided, false);
};

export default {
    validateTeamMemberImage,
    validateTeamMemberImageUpdate
};