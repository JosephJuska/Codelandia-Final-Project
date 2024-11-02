import { ValidationError, ValidationSuccess } from './validation-result';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const validateIsProvided = (value, valueName) => {
    value = typeof value === 'string' ? value.trim() : value;
    if(value === null || value === '' || value === undefined) return new ValidationError(`${valueName} must be provided`);
    return new ValidationSuccess(value);
};

const validateIsCorrectType = (value, valueName, type) => {
    let converted;
    if (type === 'string') {
        if (typeof value !== 'string') return new ValidationError(`${valueName} must be a string`);

    } else if (type === 'number') {
        converted = Number(value);
        if (isNaN(converted)) return new ValidationError(`${valueName} must be a number`);

    } else if (type === 'boolean') {
        converted = value === 'true' ? true : value === 'false' ? false : value === true ? true : value === false ? false : '';
        if (typeof converted !== type) return new ValidationError(`${valueName} must be a boolean`);

    } else return new ValidationError(`${valueName} must be of type ${type}`);
    return new ValidationSuccess(converted);
};

const validateIsCorrectLength = (value, valueName, minLength = null, maxLength = null) => {
    if((minLength && value.length < minLength) || (maxLength && value.length > maxLength)) {
        let errorMessage;
        if(minLength && maxLength) errorMessage = `${valueName} must be between ${minLength} and ${maxLength} characters long`;
        else if(minLength) errorMessage = `${valueName} must be longer than ${minLength} characters`
        else errorMessage = `${valueName} must be shorter than ${maxLength} characters`;
        return new ValidationError(errorMessage); 
    }

    return new ValidationSuccess();
};

const validateImageIsCorrectRatio = async (file, valueName, ratio) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const aspectRatio = img.width / img.height;
            let errorMessage = '';

            if(ratio - 0.01 > aspectRatio || ratio + 0.01 < aspectRatio) {
                errorMessage = `${valueName} must be in ratio ${ratio}. Current ratio: ${aspectRatio}.`;
            };

            if (errorMessage) {
                resolve(new ValidationError(errorMessage));
            } else {
                resolve(new ValidationSuccess());
            }
        };

        img.onerror = () => resolve(new ValidationError(`Invalid image file for ${valueName}`));
        img.src = URL.createObjectURL(file);
    });
};

const validateImageIsCorrectSize = async (file, valueName, maxSize, maxSizeName) => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const size = file.size;
            if (size > maxSize) return resolve(new ValidationError(`${valueName} must be no bigger than ${maxSizeName}`));

            return resolve(new ValidationSuccess());
        };

        img.onerror = () => resolve(new ValidationError(`Invalid image file for ${valueName}`));
        img.src = URL.createObjectURL(file);
    });
};

const validateIsPositive = (value, valueName) => {
    if(value <= 0) return new ValidationError(`${valueName} must be positive`);
    return new ValidationSuccess();
};

const validateIsBiggerThanZero = (value, valueName) => {
    if(value < 0) return new ValidationError(`${valueName} must be greater than zero`);
    return new ValidationSuccess();
};

const validateIsInteger = (value, valueName) => {
    if(!Number.isInteger(value)) return new ValidationError(valueName + ' must be an integer');
    return new ValidationSuccess(Number.parseInt(value));
};

const validateIsFloat = (value, valueName) => {
    if(!Number.parseFloat(value)) return new ValidationError(valueName + ' must be a point number');
    return new ValidationSuccess(Number.parseFloat(value));
}

const validateIsInRange = (value, valueName, min = null, max = null) => {
    if((min !== null && value < min) || (max !== null && value > max)) {
        let errorMessage;
        if(min !== null && max !== null) errorMessage = `${valueName} must be between ${min} and ${max}`;
        else if(min !== null) errorMessage = `${valueName} must be bigger than ${min}`;
        else if(max !== null) errorMessage = `${valueName} must be smaller than ${max}`;
        return new ValidationError(errorMessage);
    }

    return new ValidationSuccess();
};

const validateIsArray = (value, valueName) => {
    if(!Array.isArray(value)) return new ValidationError(valueName + ' must be an array');
    return new ValidationSuccess();
};

const validateIsObject = (value, valueName) => {
    if(typeof value !== 'object' || value === null || value === undefined || Array.isArray(value)) return new ValidationError(valueName + ' must be an object');
    return new ValidationSuccess();
};

const validateIsCorrectValue = (value, valueName, values) => {
    if(!values.includes(value)) return new ValidationError(`${valueName} must be one of the following: ${values.join(', ')}`);
    return new ValidationSuccess();
};

const validateIsDate = (value, valueName) => {
    const date = dayjs(value);
    if(!date.isValid()) return new ValidationError(`${valueName} must be a valid date`);
    
    const isUTC = date.isUTC();
    const hasTimeZone = date.tz();
    if(!isUTC && !hasTimeZone) return new ValidationError(`${valueName} must have a time zone specified`);

    return new ValidationSuccess(date.toISOString());
};

export {
    validateIsProvided,
    validateIsCorrectType,
    validateIsCorrectLength,
    validateIsPositive,
    validateIsBiggerThanZero,
    validateIsInteger,
    validateIsFloat,
    validateIsInRange,
    validateIsArray,
    validateIsObject,
    validateImageIsCorrectRatio,
    validateImageIsCorrectSize,
    validateIsCorrectValue,
    validateIsDate
};