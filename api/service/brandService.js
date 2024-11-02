const orm = require("../database/orm");
const queries = require("../database/queries");
const Brand = require("../model/Brand");
const databaseResultHasData = require("../utils/database-has-data");

const createBrand = async (name, code, imagePath) => {
    const result = await orm.makeRequest(queries.BRAND.CREATE_BRAND, [name, code, imagePath]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateBrand = async (id, name, code, imagePath) => {
    const result = await orm.makeRequest(queries.BRAND.UPDATE_BRAND, [id, name, code, imagePath]);
    return result;
};

const deleteBrand = async (id) => {
    const result = await orm.makeRequest(queries.BRAND.DELETE_BRAND, [id]);
    return result;
};

const getBrands = async (searchTerm, sortBy, limit, offset, safe = true) => {
    const result = await orm.makeRequest(queries.BRAND.GET_BRANDS, [searchTerm, sortBy, limit, offset]);
    if(databaseResultHasData(result)){
        result.data = { pageCount: result.data.rows[0].page_count, brands: Brand.parseMany(result.data.rows, safe) }
    }else result.data = null;

    return result;
};

const getBrandByID = async (id, safe = true) => {
    const result = await orm.makeRequest(queries.BRAND.GET_BRAND_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = Brand.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

module.exports = {
    createBrand,
    updateBrand,
    deleteBrand,
    getBrands,
    getBrandByID
};