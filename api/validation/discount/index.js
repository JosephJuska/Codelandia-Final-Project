const validateBoolean = require("../boolean");
const validateID = require("../id");
const validateDiscountDate = require("./discount-date");
const validateDiscountPercentage = require("./discount-percentage");

const validateDiscount = (productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive) => {
    return {
        productID: [productID, async () => {return await validateID(productID, false)}],
        categoryID: [categoryID, async () => {return await validateID(categoryID, false)}],
        brandID: [brandID, async () => {return await validateID(brandID, false)}],
        productTypeID: [productTypeID, async () => {return await validateID(productTypeID, false)}],
        discountPercentage: [discountPercentage, validateDiscountPercentage],
        startDate: [startDate, async () => {return await validateDiscountDate(startDate, 'startDate')}],
        endDate: [endDate, async () => {return await validateDiscountDate(endDate, 'endDate')}],
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive')}]
    };
};

module.exports = validateDiscount