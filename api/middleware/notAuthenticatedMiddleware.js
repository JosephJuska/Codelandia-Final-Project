const { generate403Forbidden } = require("../utils/response-generator");

const notAuthenticatedMiddleware = (req, res, next) => {
    if (req?.userID || req?.roleID) return generate403Forbidden(res);

    next();
};

module.exports = notAuthenticatedMiddleware;