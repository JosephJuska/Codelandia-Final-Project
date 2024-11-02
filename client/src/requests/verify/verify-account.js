import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function verifyAccount(token) {
    const endpoint = paths.VERIFY.VERIFY_ACCOUNT + '/' + token;

    const result = await makeRequest(endpoint, METHODS.GET);
    return result;
}