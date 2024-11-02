import { validateBrandCode } from "./brand-code";
import { validateBrandImage, validateBrandImageUpdate } from "./brand-image";
import { validateBrandName } from "./brand-name";

const validateBrand = (name, code, imageBuffer) => {
    return {
        name: [name, validateBrandName],
        code: [code, validateBrandCode],
        image: [imageBuffer, validateBrandImage]
    };
};

const validateBrandUpdate = (name, code, imageBuffer) => {
    return {
        name: [name, validateBrandName],
        code: [code, validateBrandCode],
        image: [imageBuffer, validateBrandImageUpdate]
    };
};

export default {
    validateBrand,
    validateBrandUpdate
};