const validateCategoryImage = require("./category-image");
const validateCategoryName = require("./category-name")
const validateID = require("../id")

const validateCategory = (name, parentID, productTypeID, imageBuffer) => {
    return {
        name: [name, validateCategoryName],
        parentID: [parentID, async () => {return await validateID(parentID, false)}],
        productTypeID: [productTypeID, async () => {return await validateID(productTypeID, false)}],
        image: [imageBuffer, validateCategoryImage]
    }
};

const validateCategoryUpdate = (name, parentID, productTypeID, imageBuffer) => {
    return {
        name: [name, validateCategoryName],
        parentID: [parentID, async () => {return await validateID(parentID, false)}],
        productTypeID: [productTypeID, async () => {return await validateID(productTypeID, false)}],
        image: [imageBuffer, async () => {return await validateCategoryImage(imageBuffer, false)}]
    }
};

module.exports = {
    validateCategory,
    validateCategoryUpdate
};