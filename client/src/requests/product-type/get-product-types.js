import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getProductTypes(searchTerm, sortBy) {
    const endpoint = paths.PRODUCT_TYPE.GET_PRODUCT_TYPES;
    const query = { searchTerm, sortBy };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};