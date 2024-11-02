import decodeJWT from "./decode-jwt";
import isAuthenticated from "./isAuthenticated";
import { RouteCheckError, RouteCheckSuccess } from "./route-check-result";
import { clearAllTokens, getAccessToken, getRefreshToken } from "./token";

export default function isCorrectRole(requiredRoleID) {
    const authenticated = isAuthenticated();
    if (!authenticated) return new RouteCheckError(false, true);

    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    let roleID;

    if (accessToken) {
        const decodedAccessToken = decodeJWT(accessToken);
        roleID = decodedAccessToken?.roleID;
    };

    if (!roleID && refreshToken) {
        const decodedRefreshToken = decodeJWT(refreshToken);
        roleID = decodedRefreshToken?.roleID;
    };

    if (roleID === undefined) {
        clearAllTokens();
        return new RouteCheckError(true, true); 
    };

    if (roleID < requiredRoleID) return new RouteCheckError(true, false);

    return new RouteCheckSuccess();
};