const { generate401Unauthorized, generate500ServerError } = require("../utils/response-generator");

const authMiddleware = async (req, res, next) => {
    if(req?.authError && !req.authError.success){
        if(req.authError.critical) return generate500ServerError(res);
        return generate401Unauthorized(res, req.authError.error);
    }

    next();
};

module.exports = authMiddleware;