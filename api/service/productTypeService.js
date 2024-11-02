const orm = require("../database/orm");
const queries = require("../database/queries");
const { ProductType, ProductTypeField } = require("../model/ProductType");
const databaseResultHasData = require("../utils/database-has-data");

const getProductTypeByCategoryID = async (id, safe = true) => {
    let result = await orm.makeRequest(queries.PRODUCT_TYPE.GET_PRODUCT_TYPE_BY_CATEGORY_ID, [id]);
    if(databaseResultHasData(result)) result.data = ProductType.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
}

const getProductTypeByID = async (id, safe = true) => {
    let result = await orm.makeRequest(queries.PRODUCT_TYPE.GET_PRODUCT_TYPE_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = ProductType.parseOne(result.data.rows[0], safe);
    else result.data = null;
    
    return result;
};

const searchProductTypesByName = async (name, limit, offset, safe = true) => {
    let result = await orm.makeRequest(queries.PRODUCT_TYPE.SEARCH_PRODUCT_TYPES_BY_NAME, [name, limit, offset]);
    if(databaseResultHasData(result)) result.data = ProductType.parseMany(result.data.rows, safe);
    else result.data = null;

    return result;
};

const getProductTypes = async (searchTerm, sortBy, safe = true) => {
    let result = await orm.makeRequest(queries.PRODUCT_TYPE.GET_PRODUCT_TYPES, [searchTerm, sortBy]);
    if(databaseResultHasData(result)) result.data = ProductType.parseMany(result.data.rows, safe);
    else result.data = null;

    return result;
};

const createProductType = async (name) => {
    const result = await orm.makeRequest(queries.PRODUCT_TYPE.CREATE_PRODUCT_TYPE, [name]);
    return result;
};

const updateProductType = async (id, name) => {
    const result = await orm.makeRequest(queries.PRODUCT_TYPE.UPDATE_PRODUCT_TYPE, [id, name]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const deleteProductType = async (id) => {
    const result = await orm.makeRequest(queries.PRODUCT_TYPE.DELETE_PRODUCT_TYPE, [id]);
    return result;
};

const createProductTypeField = async (productTypeID, fieldTypeID, name) => {
    const result = await orm.makeRequest(queries.PRODUCT_TYPE.CREATE_PRODUCT_TYPE_FIELD, [productTypeID, fieldTypeID, name]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0].id;
    return result;
};

const updateProductTypeField = async (id, fieldTypeID, name) => {
    const result = await orm.makeRequest(queries.PRODUCT_TYPE.UPDATE_PRODUCT_TYPE_FIELD, [id, fieldTypeID, name]);
    return result;
};

const deleteProductTypeField = async (id) => {
    const result = await orm.makeRequest(queries.PRODUCT_TYPE.DELETE_PRODUCT_TYPE_FIELD, [id]);
    return result;
};

const getProductTypeFieldByID = async (id) => {
    const result = await orm.makeRequest(queries.PRODUCT_TYPE.GET_PRODUCT_TYPE_FIELD_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = ProductTypeField.parseOne(result.data.rows[0], false);
    else result.data = null;

    return result;
};

module.exports = {
    getProductTypeByCategoryID,
    getProductTypes,
    getProductTypeByID,
    searchProductTypesByName,

    createProductType,

    updateProductType,

    deleteProductType,

    createProductTypeField,

    updateProductTypeField,

    deleteProductTypeField,

    getProductTypeFieldByID
};