const validateID = require("../id");
const validateProductStock = require("../product-item/product-item-stock");
const validateProductBasePrice = require("../product/product-base-price");
const validateProductName = require("../product/product-name");

const validateProductVariation = (name, stock, productItemID, basePrice) => {
    return {
        name: [name, validateProductName],
        stock: [stock, validateProductStock],
        productItemID: [productItemID, validateID],
        basePrice: [basePrice, validateProductBasePrice]
    }
};

const validateProductVariationUpdate = (name, stock, basePrice) => {
    return {
        name: [name, validateProductName],
        stock: [stock, validateProductStock],
        basePrice: [basePrice, validateProductBasePrice]
    }
};

module.exports = {
    validateProductVariation,
    validateProductVariationUpdate
};