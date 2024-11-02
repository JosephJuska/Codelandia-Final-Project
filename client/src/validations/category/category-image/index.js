import { validateImageIsCorrectRatio, validateIsProvided } from '../../default-validators';

import validator from '../../validator';

const validateCategoryImageIsProvided = (image) => {
    return validateIsProvided(image, 'image');
};

const validateCategoryImageIsCorrectRatio = (imageBuffer) => {
    return validateImageIsCorrectRatio(imageBuffer, 'image', 1);
};

const validateCategoryImage = async (bannerBuffer) => {
    return await validator(bannerBuffer, [], [validateCategoryImageIsCorrectRatio], validateCategoryImageIsProvided);
};

const validateCategoryImageUpdate = async (bannerBuffer) => {
    return await validator(bannerBuffer, [], [validateCategoryImageIsCorrectRatio], validateCategoryImageIsProvided, false);
};

export default {
    validateCategoryImage,
    validateCategoryImageUpdate
};