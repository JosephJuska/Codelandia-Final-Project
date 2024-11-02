import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getBanners(isActive, sortBy, page) {
    const endpoint = paths.BANNER.GET_BANNERS;
    const query = { isActive, sortBy, page };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};