import { validateIsProvided, validateImageIsCorrectRatio, validateImageIsCorrectSize } from "../../default-validators";

import validator from '../../validator';

const validateBrandImageIsProvided = (imageBuffer) => {
    return validateIsProvided(imageBuffer, 'image');
};

const validateBrandImageIsCorrectRatio = (imageBuffer) => {
    return validateImageIsCorrectRatio(imageBuffer, 'image', 4);
};

const validateBrandImageIsCorrectSize = async (imageBuffer) => {
    return validateImageIsCorrectSize(imageBuffer, 'image', 1024 * 10, '10KB');
};

const validateBrandImage = async (imageBuffer) => {
    return await validator(imageBuffer, [], [validateBrandImageIsCorrectRatio, validateBrandImageIsCorrectSize], validateBrandImageIsProvided);
};

const validateBrandImageUpdate = async (imageBuffer) => {
    return await validator(imageBuffer, [], [validateBrandImageIsCorrectRatio, validateBrandImageIsCorrectSize], validateBrandImageIsProvided, false);
};

export default {
    validateBrandImage,
    validateBrandImageUpdate
};