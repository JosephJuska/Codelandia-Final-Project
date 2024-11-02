const { generate403Forbidden } = require("../utils/response-generator");

const roleMiddleware = (roleLevel) => {
    const handler = (req, res, next) => {
        if(req.roleID < roleLevel) return generate403Forbidden(res);

        next();
    };

    return handler;
}

module.exports = roleMiddleware;