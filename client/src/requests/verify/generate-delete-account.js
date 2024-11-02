import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function generateDeleteAccount() {
    const endpoint = paths.VERIFY.GENERATE_DELETE_ACCOUNT;

    const result = await makeRequest(endpoint, METHODS.GET, null, {}, {}, true);
    return result;
};