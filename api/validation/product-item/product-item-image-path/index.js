const { validateIsProvided, validateIsCorrectType, validateIsArray } = require("../../default-validators");
const { ValidationError, ValidationSuccess } = require("../../validation-result");

const validator = require('../../validator');

const validateProductImagePathsIsProvided = (imagePaths) => {
    return validateIsProvided(imagePaths, 'imagePaths');
};

const validateProductImagePathsIsArray = (imagePaths) => {
    return validateIsArray(imagePaths, 'imagePaths');
};

const validateProductImagePathsIsNotEmpty = (imagePaths) => {
    if(imagePaths.length === 0) return new ValidationError('imagePaths must not be empty');
    return new ValidationSuccess();
};  

const validateProductImagePathsIsInRange = (imagePaths) => {
    if(imagePaths.length > 5) return new ValidationError('image count must be at most 5');
    return new ValidationSuccess();
};

const validateProductImagePathIsProvided = (imagePath) => {
    return validateIsProvided(imagePath, 'imagePath');
};

const validateProductImagePathIsString = (imagePath) => {
    return validateIsCorrectType(imagePath, 'imagePath', 'string');
};

const validateProductImagePath = async (imagePath) => {
    return await validator(imagePath, [], [validateProductImagePathIsString], validateProductImagePathIsProvided);
};

const validateProductImagePathsField = async (imagePaths) => {
    return await validator(imagePaths, [], [validateProductImagePathsIsArray, validateProductImagePathsIsNotEmpty, validateProductImagePathsIsInRange], validateProductImagePathsIsProvided);
};

const validateProductImagePaths = async (imagePaths) => {
    const validationResult = await validateProductImagePathsField(imagePaths);
    if(!validationResult.success) return validationResult;

    const imagePathsSanitized = validationResult.data;

    let errors = {};
    let data = [];

    for(let i = 0; i < imagePathsSanitized.length; i++){
        const imagePath = imagePathsSanitized[i];
        const validationResult = await validateProductImagePath(imagePath);
        if(!validationResult.success) errors['image' + (i + 1)] = validationResult.error;
        else data.push(validationResult.data);
    };

    if(Object.keys(errors).length > 0) return new ValidationError({ imagePaths: errors });
    return new ValidationSuccess(data);
};

module.exports = validateProductImagePaths