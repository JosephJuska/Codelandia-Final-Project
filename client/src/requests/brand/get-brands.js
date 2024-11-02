import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getBrands(searchTerm, sortBy, page) {
    const endpoint = paths.BRAND.GET_BRANDS;
    const query = { searchTerm, sortBy, page };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};