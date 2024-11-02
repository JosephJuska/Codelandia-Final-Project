class DatabaseResult {
    constructor(success, statusCode, errorMessage, errorCode, critical, data) {
        this.success = success;
        this.statusCode = statusCode;
        this.errorMessage = errorMessage;
        this.errorCode = errorCode;
        this.critical = critical;
        this.data = data;
    }
};

class DatabaseError extends DatabaseResult {
    constructor(statusCode, errorMessage, errorCode, critical) {
        super(false, statusCode, errorMessage, errorCode, critical, null);
    }
};

class DatabaseSuccess extends DatabaseResult {
    constructor(data) {
        super(true, null, null, null, false, data);
    }
};

module.exports = {
    DatabaseError,
    DatabaseSuccess
}