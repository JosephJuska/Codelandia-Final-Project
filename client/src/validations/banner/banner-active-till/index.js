import { validateIsProvided, validateIsCorrectType, validateIsDate } from '../../default-validators';

import validator from '../../validator';

const validateBannerActiveTillIsProvided = (activeTill) => {
    return validateIsProvided(activeTill, 'activeTill');
};

const validateBannerActiveTillIsString = (activeTill) => {
    return validateIsCorrectType(activeTill, 'activeTill', 'string');
};

const validateBannerActiveTillIsValidDate = (activeTill) => {
    return validateIsDate(activeTill, 'activeTill');
};

const validateBannerActiveTill = async (activeTill) => {
    return validator(activeTill, [], [validateBannerActiveTillIsString, validateBannerActiveTillIsValidDate], validateBannerActiveTillIsProvided);
};

export default validateBannerActiveTill;