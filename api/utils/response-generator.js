const { STATUS_CODES } = require("./constants");
const { ResponseError, ResponseSuccess } = require("./response");

const generate500ServerError = (res) => {
    res.sendStatus(500);
};

const generate400BadRequest = (res, error) => {
    res.status(400).json(new ResponseError(error));    
};

const generate401Unauthorized = (res, error) => {
    res.status(401).json(new ResponseError(error));
};

const generate403Forbidden = (res, error) => {
    res.status(403).json(new ResponseError(error));
};

const generate404NotFound = (res, error) => {
    res.status(404).json(new ResponseError(error));
};

const generate409Conflict = (res, error) => {
    res.status(409).json(new ResponseError(error));
};

const generate200OK = (res, data = null) => {
    res.status(200).json(new ResponseSuccess(data));
};

const generate201Created = (res, data = null) => {
    res.status(201).json(new ResponseSuccess(data));
};

const generate202Accepted = (res, data = null) => {
    res.status(202).json(new ResponseSuccess(data));
};

const generate204NoContent = (res) => {
    res.sendStatus(204);
};

const generateDatabaseErrorResponse = (res, resultObject) => {
    return generateResponse(res, resultObject.statusCode, resultObject.errorMessage, resultObject.critical);
};

const generateResponse = (res, statusCode, body, critical = false) => {
    if(critical) return generate500ServerError(res);
    switch(statusCode) {
        case STATUS_CODES.OK_200:
            generate200OK(res, body);
            break;
        case STATUS_CODES.CREATED_201:
            generate201Created(res, body);
            break;
        case STATUS_CODES.ACCEPTED_202:
            generate202Accepted(res, body);
            break;
        case STATUS_CODES.NO_CONTENT_204:
            generate204NoContent(res);
            break;
        case STATUS_CODES.BAD_REQUEST_400:
            generate400BadRequest(res, body);
            break;
        case STATUS_CODES.UNAUTHORIZED_401:
            generate401Unauthorized(res, body);
            break;
        case STATUS_CODES.FORBIDDEN_403:
            generate403Forbidden(res, body);
            break;
        case STATUS_CODES.NOT_FOUND_404:
            generate404NotFound(res, body);
            break;
        case STATUS_CODES.CONFLICT_409:
            generate409Conflict(res, body);
            break;
        case STATUS_CODES.SERVER_ERROR_500:
            generate500ServerError(res);
            break;
        default:
            generate500ServerError(res);
    };
};

module.exports = {
    generate200OK,
    generate201Created,
    generate202Accepted,
    generate204NoContent,

    generate400BadRequest,
    generate401Unauthorized,
    generate403Forbidden,
    generate404NotFound,
    generate409Conflict,
    
    generate500ServerError,

    generateDatabaseErrorResponse,

    generateResponse
};