import methods from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import { getRefreshToken } from "../../utils/token";

export default async function logout() {
    const endpoint = paths.AUTH.LOGOUT;

    const refreshToken = getRefreshToken();
    const result = await makeRequest(endpoint, methods.POST, { token: refreshToken }, {}, {}, true);
    return result;
};