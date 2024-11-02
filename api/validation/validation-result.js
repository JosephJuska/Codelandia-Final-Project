class ValidationResult {
    constructor(success, error, data = null) {
        this.success = success;
        this.error = error;
        this.data = data;
    }
}

class ValidationSuccess extends ValidationResult {
    constructor(data = null) {
        super(true, null, data);
    }
}

class ValidationError extends ValidationResult {
    constructor(error, data = null) {
        super(false, error, data);
    }
}

module.exports = {
    ValidationError,
    ValidationSuccess
}