import methods from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getAccountDetailsWriter () {
    const endpoint = paths.USER.GET_ACCOUNT_DETAILS_WRITER;

    const result = await makeRequest(endpoint, methods.GET, null, {}, {}, true);
    return result;
};