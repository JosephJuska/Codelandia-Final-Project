const { ValidationError, ValidationSuccess } = require('./validation-result');

const massValidator = async (validations) => {
    let errors = {};
    let data = {};

    const validationPromises = Object.entries(validations).map(async ([key, [value, validator]]) => {
        const validationResult = await validator(value);
        if (!validationResult.success) errors[key] = validationResult.error;
        else data[key] = validationResult.data;
    });

    await Promise.all(validationPromises);

    if(Object.keys(errors).length > 0) return new ValidationError(errors, data);
    return new ValidationSuccess(data);
};

module.exports = massValidator;