const validateID = require("../id")
const validateProductColour = require("./product-item-colour")
const validateProductImagePaths = require("./product-item-image-path")
const validateProductStock = require("./product-item-stock")

const validateProductItem = (productID, stock, colour1, colour2, colour3, image_paths) => {
    return {
        productID: [productID, validateID],
        stock: [stock, validateProductStock],
        colour1: [colour1, validateProductColour],
        colour2: [colour2, async () => {return await validateProductColour(colour2, false)}],
        colour3: [colour3, async () => {return await validateProductColour(colour3, false)}],
        imagePaths: [image_paths, validateProductImagePaths]
    }
};

const validateProductItemUpdate = (stock, colour1, colour2, colour3, image_paths) => {
    return {
        stock: [stock, validateProductStock],
        colour1: [colour1, validateProductColour],
        colour2: [colour2, async () => {return await validateProductColour(colour2, false)}],
        colour3: [colour3, async () => {return await validateProductColour(colour3, false)}],
        imagePaths: [image_paths, validateProductImagePaths]
    }
};

module.exports = {
    validateProductItem,
    validateProductItemUpdate
};