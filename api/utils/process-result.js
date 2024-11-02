class ProcessResult {
    constructor(success, error, critical, data = null) {
        this.success = success;
        this.error = error;
        this.critical = critical;
        this.data = data;
    }
};

class ProcessError extends ProcessResult {
    constructor(error, critical = false) {
        super(false, error, critical);
    }
};

class ProcessSuccess extends ProcessResult {
    constructor(data = null) {
        super(true, null, false, data);
    }
};

module.exports = {
    ProcessError,
    ProcessSuccess
}