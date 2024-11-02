import { validateIsProvided, validateImageIsCorrectRatio } from "../../default-validators";

import validator from '../../validator';

const validateProductImageIsProvided = (imageBuffer) => {
    return validateIsProvided(imageBuffer, 'image');
};

const validateProductImageIsCorrectRatio = async (imageBuffer) => {
    return await validateImageIsCorrectRatio(imageBuffer, 'image', 1, 1);
};

const validateProductImage = async (imageBuffer) => {
    return await validator(imageBuffer, [], [validateProductImageIsCorrectRatio], validateProductImageIsProvided);
};

export default validateProductImage;