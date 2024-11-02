import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateEmail (token) {
    const endpoint = paths.VERIFY.UPDATE_EMAIL + '/' + token;

    const result = await makeRequest(endpoint, METHODS.GET);
    return result;
};