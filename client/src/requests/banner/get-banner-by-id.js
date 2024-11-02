import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getBannerByID(id) {
    const endpoint = paths.BANNER.GET_BANNER_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.GET, null, {}, {}, true);
    return result;
};