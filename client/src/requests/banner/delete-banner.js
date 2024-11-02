import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteBanner(id) {
    const endpoint = paths.BANNER.DELETE_BANNER + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, {}, {}, true);
    return result;
};