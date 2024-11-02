const orm = require("../database/orm");
const queries = require("../database/queries");
const Favorite = require("../model/Favorite");
const databaseResultHasData = require("../utils/database-has-data");

const createFavorite = async (userID, productID) => {
    const result = await orm.makeRequest(queries.FAVORITE.CREATE_FAVORITE, [userID, productID]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const deleteFavorite = async (id, userID) => {
    const result = await orm.makeRequest(queries.FAVORITE.DELETE_FAVORITE, [id, userID]);
    return result;
};

const getFavorites = async (userID, limit, offset, safe = true) => {
    const result = await orm.makeRequest(queries.FAVORITE.GET_FAVORITES, [userID, limit, offset]);
    if(databaseResultHasData(result)) Favorite.parseMany(result.data.rows, safe)
    else result.data = null;

    return result;
};

module.exports = {
    createFavorite,
    deleteFavorite,
    getFavorites
};