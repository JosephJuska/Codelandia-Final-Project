import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";

import validator from '../../validator';

const validateTeamMemberShortDescriptionIsProvided = (shortDescription) => {
    return validateIsProvided(shortDescription, 'shortDescription');
};

const validateTeamMemberShortDescriptionIsString = (shortDescription) => {
    return validateIsCorrectType(shortDescription, 'shortDescription', 'string');
};

const validateTeamMemberShortDescriptionIsCorrectLength = (shortDescription) => {
    return validateIsCorrectLength(shortDescription, 'shortDescription', 2, 100);
};

const validateTeamMemberShortDescription = async (shortDescription) => {
    return await validator(shortDescription, [], [validateTeamMemberShortDescriptionIsString, validateTeamMemberShortDescriptionIsCorrectLength], validateTeamMemberShortDescriptionIsProvided);
};

export default validateTeamMemberShortDescription;