const getDateInString = require('../utils/get-date-in-string');
const logData = require('../utils/log-data');
const LoggingData = require('../utils/log-data-object');

const logMiddleware = (req, res, next) => {
    const originalSend = res.send;

    const reqDetails = {
        ip: req.ip,
        method: req.method,
        userID: req.userID || 'Anonymous',
        roleID: req.roleID || 'Unknown',
        path: req.path,
        headers: req.headers,
        body: req.body,
        time: getDateInString(new Date())
    };

    res.send = function (body) {
        const resDetails = {
            statusCode: res.statusCode,
            headers: res.getHeaders(),
            body: body
        };

        const logEntry = new LoggingData(
            'Request processed',
            {
                requestDetails: reqDetails,
                responseDetails: resDetails
            },
            null
        );

        logData(logEntry, 'requests');

        return originalSend.apply(this, arguments);
    };

    next();
};

module.exports = logMiddleware;