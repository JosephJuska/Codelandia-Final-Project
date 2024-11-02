import { validateIsProvided, validateIsCorrectType, validateIsCorrectLength } from '../../default-validators';

import validator from '../../validator';

const validateBannerSubHeaderIsProvided = (subHeader) => {
    return validateIsProvided(subHeader, 'subHeader');
};

const validateBannerSubHeaderIsString = (subHeader) => {
    return validateIsCorrectType(subHeader, 'subHeader', 'string');
};

const validateBannerSubHeaderIsCorrectLength = (subHeader) => {
    return validateIsCorrectLength(subHeader, 'subHeader', 2, 50);
};

const validateBannerSubHeader = async (subHeader) => {
    return await validator(subHeader, [], [validateBannerSubHeaderIsString, validateBannerSubHeaderIsCorrectLength], validateBannerSubHeaderIsProvided);
};

export default validateBannerSubHeader;