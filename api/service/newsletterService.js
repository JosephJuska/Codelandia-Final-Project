const orm = require("../database/orm")
const queries = require("../database/queries")

const createSubscriber = async (email, token) => {
    const result = await orm.makeRequest(queries.NEWSLETTER.CREATE_SUBSCRIBER, [email, token]);
    return result;
};

const unsubscribe = async (token) => {
    const result = await orm.makeRequest(queries.NEWSLETTER.UNSUBSCRIBE, [token]);
    return result;
};

module.exports = {
    createSubscriber,
    unsubscribe
};