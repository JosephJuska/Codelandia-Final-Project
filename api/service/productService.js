const orm = require("../database/orm");
const queries = require("../database/queries");
const Product = require("../model/Product");
const databaseResultHasData = require("../utils/database-has-data");

const createProduct = async (name, description, sku, slug, brandID, categoryID, basePrice, fields) => {
    const result = await orm.makeRequest(queries.PRODUCT.CREATE_PRODUCT, [name, description, sku, slug, brandID, categoryID, basePrice, fields]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateProduct = async (id, name, description, sku, slug, brandID, categoryID, basePrice, isActive, fields) => {
    const result = await orm.makeRequest(queries.PRODUCT.UPDATE_PRODUCT, [id, name, description, sku, slug, brandID, categoryID, basePrice, isActive, fields]);
    return result;
};

const deleteProduct = async (id) => {
    const result = await orm.makeRequest(queries.PRODUCT.DELETE_PRODUCT, [id]);
    return result;
};

const createProductItem = async (productID, stock, colour1, colour2, colour3, imagePaths) => {
    const result = await orm.makeRequest(queries.PRODUCT.CREATE_PRODUCT_ITEM, [productID, stock, colour1, colour2, colour3, imagePaths]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0].id;
    else result.data = null;
    return result;
};

const updateProductItem = async (id, stock, colour1, colour2, colour3, imagePaths) => {
    const result = await orm.makeRequest(queries.PRODUCT.UPDATE_PRODUCT_ITEM, [id, stock, colour1, colour2, colour3, imagePaths]);
    return result;
};

const deleteProductItem = async (id) => {
    const result = await orm.makeRequest(queries.PRODUCT.DELETE_PRODUCT_ITEM, [id]);
    return result;
};

const createProductVariation = async (name, stock, productItemID, basePrice) => {
    const result = await orm.makeRequest(queries.PRODUCT.CREATE_PRODUCT_VARIATION, [name, stock, productItemID, basePrice]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0].id;
    else result.data = null;
    return result;
};

const updateProductVariation = async (id, name, stock, basePrice) => {
    const result = await orm.makeRequest(queries.PRODUCT.UPDATE_PRODUCT_VARIATION, [id, name, stock, basePrice]);
    return result;
};

const deleteProductVariation = async (id) => {
    const result = await orm.makeRequest(queries.PRODUCT.DELETE_PRODUCT_VARIATION, [id]);
    return result;
};

const createProductVariationField = async (value, productVariationID, productTypeFieldID) => {
    const result = await orm.makeRequest(queries.PRODUCT.CREATE_PRODUCT_VARIATION_FIELD, [value, productVariationID, productTypeFieldID]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0].id;
    else result.data = null;
    return result;
};  

const updateProductVariationField = async (id, value, productTypeFieldID) => {
    const result = await orm.makeRequest(queries.PRODUCT.UPDATE_PRODUCT_VARIATION_FIELD, [id, value, productTypeFieldID]);
    return result;
};

const deleteProductVariationField = async (id) => {
    const result = await orm.makeRequest(queries.PRODUCT.DELETE_PRODUCT_VARIATION_FIELD, [id]);
    return result;
};  

const getProducts = async (searchTerm, sortBy, isActive, categoryID, brandID, hasDiscount, startPrice, endPrice, limit, offset) => {
    const result = await orm.makeRequest(queries.PRODUCT.GET_PRODUCTS, [searchTerm, sortBy, isActive, categoryID, brandID, hasDiscount, startPrice, endPrice, limit, offset]);
    if(databaseResultHasData(result)) result.data = { pageCount: result.data.rows[0].page_count, products: Product.parseMany(result.data.rows) };
    else result.data = null;
    return result;
};

const getProductsList = async () => {
    const result = await orm.makeRequest(queries.PRODUCT.GET_PRODUCTS_LIST, []);
    if(databaseResultHasData(result)) result.data = Product.parseMany(result.data.rows);
    else result.data = null;

    return result;
};

const getProductByID = async (id, isActive = null) => {
    const result = await orm.makeRequest(queries.PRODUCT.GET_PRODUCT_BY_ID, [id, isActive]);
    if(databaseResultHasData(result)) result.data = Product.parseOne(result.data.rows[0], isActive ? true : false);
    else result.data = null;

    return result;
};

module.exports = {
    createProduct,
    updateProduct,
    deleteProduct,

    createProductItem,
    updateProductItem,
    deleteProductItem,

    createProductVariation,
    updateProductVariation,
    deleteProductVariation,

    createProductVariationField,
    updateProductVariationField,
    deleteProductVariationField,

    getProducts,
    getProductsList,
    getProductByID
};