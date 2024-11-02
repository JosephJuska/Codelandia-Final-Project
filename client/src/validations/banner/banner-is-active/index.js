import { validateIsProvided, validateIsCorrectType} from '../../default-validators';

import validator from '../../validator';

const validateBannerIsActiveIsProvided = (active) => {
    return validateIsProvided(active, 'active');
};

const validateBannerIsActiveIsBoolean = (active) => {
    return validateIsCorrectType(active, 'active', 'boolean');
};

const validateBannerIsActive = async (active, provided = true) => {
    return await validator(active, [], [validateBannerIsActiveIsBoolean], validateBannerIsActiveIsProvided, provided);
};

export default validateBannerIsActive;