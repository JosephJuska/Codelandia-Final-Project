const orm = require("../database/orm");
const queries = require("../database/queries");
const Currency = require("../model/Currency");
const databaseResultHasData = require("../utils/database-has-data");

const getCurrency = async () => {
    const result = await orm.makeRequest(queries.CURRENCY.GET_CURRENCY, []);
    if(databaseResultHasData(result)) result.data = Currency.parseOne(result.data.rows[0]);
    else result.data = null;

    return result;
};

const updateCurrency = async (azn, eur, trl) => {
    const result = await orm.makeRequest(queries.CURRENCY.UPDATE_CURRENCY, [azn, eur, trl]);
    return result;
};

module.exports = {
    getCurrency,
    updateCurrency
};