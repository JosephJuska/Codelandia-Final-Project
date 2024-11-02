const validateToken = require("../validation/token");
const { verifyAccessToken } = require("../utils/token");

const errorMessages = require('../utils/error-messages');
const { ProcessError } = require("../utils/process-result");

const getUserInfoMiddleware = async (req, _, next) => {
    const authHeader = req.headers['authorization'];
    req.userID = null;
    req.roleID = null;
    req.authError = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const accessToken = authHeader.split(' ')[1];
        
        const tokenValidationResult = await validateToken(accessToken);
        if(tokenValidationResult.success){
            const token = tokenValidationResult.data;

            const verifyTokenResult = verifyAccessToken(token);
            if(verifyTokenResult.success){
                const payload = verifyTokenResult.data;

                req.userID = payload.userID;
                req.roleID = payload.roleID;
            }else{
                req.authError = new ProcessError(verifyTokenResult.error, verifyTokenResult.critical);
            }

        }else{
            req.authError = new ProcessError(tokenValidationResult.error);
        }

    }else{
        req.authError = new ProcessError(errorMessages.AUTHORIZATION_HEADER_BAD);
    };

    next();
};

module.exports = getUserInfoMiddleware;