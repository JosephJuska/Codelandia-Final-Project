import { RouteCheckError, RouteCheckSuccess } from "./route-check-result";
import { clearAllTokens, getAccessToken, getRefreshToken } from "./token";

export default function isAuthenticated (){
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    if(!accessToken && !refreshToken){
        clearAllTokens();
        return new RouteCheckError(false, true);
    };
        
    return new RouteCheckSuccess();
};