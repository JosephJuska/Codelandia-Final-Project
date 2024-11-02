const orm = require("../database/orm")
const queries = require("../database/queries");
const Session = require("../model/Session");
const databaseResultHasData = require("../utils/database-has-data");

const createSession = async (userID, token) => {
    const result = await orm.makeRequest(queries.SESSION.CREATE_SESSION, [userID, token]);
    return result;
};

const getSession = async (userID, token, expired = false) => {
    const result = await orm.makeRequest(queries.SESSION.getSession(expired), [userID, token]);
    if(databaseResultHasData(result)) result.data = Session.parseOne(result.data.rows[0]);
    else result.data = null;

    return result;
};

const finishSession = async (userID, token) => {
    const result = await orm.makeRequest(queries.SESSION.FINISH_SESSION, [userID, token]);
    return result;
}

module.exports = {
    createSession,
    getSession,
    finishSession
};