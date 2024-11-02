const jwt = require('jsonwebtoken');

const jwtConfig = require('../config/jwt');
const { ProcessSuccess, ProcessError } = require('./process-result');

const errorMessages = require('./error-messages');

const logData = require('./log-data');
const LoggingData = require('./log-data-object');

const generateToken = (payload, secret, options) => {
    let logEntry;
    try{
        payload = {...payload, creationTime: Date.now()};
        const token = jwt.sign(payload, secret, options);
        logEntry = new LoggingData(
            'Token generated successfully',
            null,
            null
        );
        logData(logEntry, 'token');
        return new ProcessSuccess(token);
    }catch(e){
        console.log('TOKEN GENERATION ERROR:' + e.message);
        logEntry = new LoggingData(
            e.message,
            null,
            e
        );
        logData(logEntry, 'token');
        return new ProcessError("", true);
    }
}

const verifyToken = (token, secret) => {
    let logEntry;
    try{
        const payload = jwt.verify(token, secret);
        logEntry = new LoggingData(
            'Token verified successfully',
            null,
            null
        );
        logData(logEntry, 'token');
        return new ProcessSuccess(payload);
    }catch(e){
        logEntry = new LoggingData(
            e.message,
            null,
            e
        );
        logData(logEntry, 'token');
        if(e instanceof jwt.TokenExpiredError) return new ProcessError(errorMessages.TOKEN_EXPIRED);
        if(e instanceof jwt.JsonWebTokenError) return new ProcessError(errorMessages.TOKEN_INVALID);
        return new ProcessError('', true);
    }
}

const generateVerificationToken = (payload) => {
    const options = { expiresIn: '30m' };
    return generateToken(payload, jwtConfig.VERIFICATION_TOKEN_SECRET, options);
};

const generateAccessToken = (payload) => {
    const options = { expiresIn: '15m' };
    return generateToken(payload, jwtConfig.ACCESS_TOKEN_SECRET, options);
};

const generateRefreshToken = (payload) => {
    const options = { expiresIn: '7d' };
    return generateToken(payload, jwtConfig.REFRESH_TOKEN_SECRET, options);
};

const verifyRefreshToken = (token) => {
    return verifyToken(token, jwtConfig.REFRESH_TOKEN_SECRET);
};

const verifyAccessToken = (token) => {
    return verifyToken(token, jwtConfig.ACCESS_TOKEN_SECRET);
};

const verifyVerificationToken = (token) => {
    return verifyToken(token, jwtConfig.VERIFICATION_TOKEN_SECRET);
};

module.exports = {
    generateVerificationToken,
    generateAccessToken,
    generateRefreshToken,

    verifyRefreshToken,
    verifyAccessToken,
    verifyVerificationToken
}