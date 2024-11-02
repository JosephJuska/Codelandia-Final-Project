const validateBrandCode = require("./brand-code");
const validateBrandImage = require("./brand-image");
const validateBrandName = require("./brand-name");

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
        image: [imageBuffer, async () => {return await validateBrandImage(imageBuffer, false)}]
    };
};

module.exports = {
    validateBrand,
    validateBrandUpdate
};