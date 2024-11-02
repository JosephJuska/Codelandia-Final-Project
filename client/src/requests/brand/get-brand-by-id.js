import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getBrandByID(id) {
    const endpoint = paths.BRAND.GET_BRAND_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.GET, null, {}, {}, true);
    return result;
};