const validateID = require("../id");
const validateProductBasePrice = require("./product-base-price");
const validateProductDescription = require("./product-description");
const { validateProductFieldsFirstCheck } = require("./product-fields");
const validateProductIsActive = require("./product-is-active");
const validateProductName = require("./product-name");
const validateProductSKU = require("./product-sku");

const validateProductReceive = (name, description, sku, brandID, categoryID, basePrice, fields) => {
    return {
        name: [name, validateProductName],
        description: [description, validateProductDescription],
        sku: [sku, validateProductSKU],
        brandID: [brandID, validateID],
        categoryID: [categoryID, validateID],
        basePrice: [basePrice, validateProductBasePrice],
        fields: [fields, validateProductFieldsFirstCheck]
    }
};

const validateProductUpdate = (name, description, sku, brandID, categoryID, basePrice, isActive, fields) => {
    return {
        name: [name, validateProductName],
        description: [description, validateProductDescription],
        sku: [sku, validateProductSKU],
        brandID: [brandID, validateID],
        categoryID: [categoryID, validateID],
        basePrice: [basePrice, validateProductBasePrice],
        isActive: [isActive, validateProductIsActive],
        fields: [fields, validateProductFieldsFirstCheck]
    }
}

module.exports = {
    validateProductReceive,
    validateProductUpdate
};