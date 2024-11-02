class ValidationResult {
    constructor(success, error, data = null) {
        this.success = success;
        this.error = error;
        this.data = data;
    }
}

export class ValidationSuccess extends ValidationResult {
    constructor(data = null) {
        super(true, null, data);
    }
}

export class ValidationError extends ValidationResult {
    constructor(error, data = null) {
        super(false, error, data);
    }
}