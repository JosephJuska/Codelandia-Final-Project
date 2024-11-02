import { ValidationSuccess } from './validation-result';

export default async function validator (value, props, callbacks, providedCallback, provided = true) {
    const providedResult = await providedCallback(value, ...props);
    if(!providedResult.success && provided) return providedResult;
    if(!providedResult.success && !provided) return new ValidationSuccess(null);

    value = providedResult.data;
    for(let i = 0; i < callbacks.length; i++) {
        const validationResult = await callbacks[i](value, ...props);
        if(!validationResult.success) return validationResult;

        value = validationResult.data ? validationResult.data : value;
    }

    return new ValidationSuccess(value);
};