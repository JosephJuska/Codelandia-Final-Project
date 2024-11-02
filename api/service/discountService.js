const orm = require("../database/orm");
const queries = require("../database/queries");
const Discount = require("../model/Discount");
const databaseResultHasData = require("../utils/database-has-data");

const createDiscount = async (productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive) => {
    const result = await orm.makeRequest(queries.DISCOUNT.CREATE_DISCOUNT, [productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateDiscount = async (id, productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive) => {
    const result = await orm.makeRequest(queries.DISCOUNT.UPDATE_DISCOUNT, [id, productID, categoryID, brandID, productTypeID, discountPercentage, startDate, endDate, isActive]);
    return result;
};

const deleteDiscount = async (id) => {
    const result = await orm.makeRequest(queries.DISCOUNT.DELETE_DISCOUNT, [id]);
    return result;
};

const getDiscountByID = async (id) => {
    const result = await orm.makeRequest(queries.DISCOUNT.GET_DISCOUNT_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = Discount.parseOne(result.data.rows[0], false);
    else result.data = null;

    return result;
};

const getDiscounts = async (isActive, sortBy, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, limit, offset) => {
    const result = await orm.makeRequest(queries.DISCOUNT.GET_DISCOUNTS, [isActive, sortBy, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, limit, offset]);
    if(databaseResultHasData(result)) {
        result.data = { pageCount: result.data.rows[0].page_count, discounts: Discount.parseMany(result.data.rows, false) };
    }else result.data = null;

    return result;
};

module.exports = {
    createDiscount,
    updateDiscount,
    deleteDiscount,
    getDiscountByID,
    getDiscounts
};