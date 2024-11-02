class Result {
    constructor(success, data, error, critical=false, unauthorized=false, forbidden=false, notFound=false){
        this.success = success;
        this.data = data;
        this.error = error;
        this.critical = critical;
        this.unauthorized = unauthorized;
        this.forbidden = forbidden;
        this.notFound = notFound;
    };
};

export class ResultSuccess extends Result {
    constructor(data){
        super(true, data, null);
    };
};

export class ResultError extends Result {
    constructor(error, critical = false, unauthorized=false, forbidden=false, notFound=false){
        super(false, null, error, critical, unauthorized, forbidden, notFound);
    };
};