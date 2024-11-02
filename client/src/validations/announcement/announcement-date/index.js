import { validateIsProvided, validateIsCorrectType, validateIsDate } from '../../default-validators';

import validator from '../../validator';

const validateAnnouncementDateIsProvided = (date, valueName) => {
    return validateIsProvided(date, valueName);
};

const validateAnnouncementDateIsString = (date, valueName) => {
    return validateIsCorrectType(date, valueName, 'string');
};

const validateAnnouncementDateIsValidDate = (date, valueName) => {
    return validateIsDate(date, valueName);
};

const validateAnnouncementDate = async (date, valueName) => {
    return validator(date, [valueName], [validateAnnouncementDateIsString, validateAnnouncementDateIsValidDate], validateAnnouncementDateIsProvided);
};

export default validateAnnouncementDate;