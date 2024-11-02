import makeRequest from "../../utils/make-request";
import paths from '../../utils/constants/paths';
import methods from "../../utils/constants/methods";

export default async function loginAdmin(usernameOrEmail, password, isWriter = false) {
    const body = { usernameOrEmail, password };
    const endpoint = isWriter? paths.AUTH.LOGIN_WRITER : paths.AUTH.LOGIN_ADMIN;
    const response = await makeRequest(endpoint, methods.POST, body, {}, {});
    return response;
};