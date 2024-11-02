import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from "../../default-validators";

import validator from '../../validator';

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

export default validateAnnouncementTitle;