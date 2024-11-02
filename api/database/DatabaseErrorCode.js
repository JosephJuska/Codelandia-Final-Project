class DatabaseErrorCode {
    constructor(statusCode, message = null, critical = false) {
        this.message = message;
        this.critical = critical;
        this.statusCode = critical ? 500 : statusCode;
    };
};

module.exports = DatabaseErrorCode;