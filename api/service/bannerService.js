const orm = require("../database/orm");
const queries = require("../database/queries");
const Banner = require("../model/Banner");
const databaseResultHasData = require("../utils/database-has-data");

const createBanner = async (header, subHeader, backgroundPath, buttonText, buttonLink, isActive, isActiveTill) => {
    const result = await orm.makeRequest(queries.BANNER.CREATE_BANNER, [header, subHeader, backgroundPath, buttonText, buttonLink, isActive, isActiveTill]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateBanner = async (id, header, subHeader, backgroundPath, buttonText, buttonLink, isActive, isActiveTill) => {
    const result = await orm.makeRequest(queries.BANNER.UPDATE_BANNER, [id, header, subHeader, backgroundPath, buttonText, buttonLink, isActive, isActiveTill]);
    return result;
};

const deleteBanner = async (id) => {
    const result = await orm.makeRequest(queries.BANNER.DELETE_BANNER, [id]);
    return result;
};

const getBannerByID = async (id, safe = true) => {
    const result = await orm.makeRequest(queries.BANNER.GET_BANNER_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = Banner.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

const getBanners = async (isActive, sortBy, limit, offset, safe = true) => {
    const result = await orm.makeRequest(queries.BANNER.GET_BANNERS, [isActive, sortBy, limit, offset]);
    if(databaseResultHasData(result)) {
        result.data = { pageCount: result.data.rows[0].page_count, banners: Banner.parseMany(result.data.rows, safe)};
    }
    else result.data = null;

    return result;
};

module.exports = {
    createBanner,
    updateBanner,
    deleteBanner,
    getBannerByID,
    getBanners,
};