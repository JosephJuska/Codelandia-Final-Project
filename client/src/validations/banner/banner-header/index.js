import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from '../../default-validators';

import validator from '../../validator';

const validateBannerHeaderIsProvided = (header) => {
    return validateIsProvided(header, 'header');
};

const validateBannerHeaderIsString = (header) => {
    return validateIsCorrectType(header, 'header', 'string');
};

const validateBannerHeaderIsCorrectLength = (header) => {
    return validateIsCorrectLength(header, 'header', 2, 50);
};

const validateBannerHeader = async (header) => {
    return await validator(header, [], [validateBannerHeaderIsString, validateBannerHeaderIsCorrectLength], validateBannerHeaderIsProvided);
};

export default validateBannerHeader;