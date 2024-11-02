import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteBrand(id) {
    const endpoint = paths.BRAND.DELETE_BRAND + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, {}, {}, true);
    return result;
};