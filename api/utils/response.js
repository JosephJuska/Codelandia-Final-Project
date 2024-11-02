class Response {
    constructor(success, error, data = null) {
        this.success = success;
        this.error = error;
        this.data = data;
    }
};

class ResponseSuccess extends Response {
    constructor(data = null) {
        super(true, null, data);
    }
};

class ResponseError extends Response {
    constructor(error) {
        super(false, error, null);
    }
};

module.exports = {
    ResponseError,
    ResponseSuccess
}