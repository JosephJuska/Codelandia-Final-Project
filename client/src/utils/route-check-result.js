class RouteCheckResult {
    constructor(success, isRoleError, isAuthError) {
        this.success = success;
        this.isRoleError = isRoleError;
        this.isAuthError = isAuthError;
    };
};

export class RouteCheckSuccess extends RouteCheckResult {
    constructor(){
        super(true);
    };
};

export class RouteCheckError extends RouteCheckResult {
    constructor(isRoleError, isAuthError) {
        super(false, isRoleError, isAuthError);
    };
};