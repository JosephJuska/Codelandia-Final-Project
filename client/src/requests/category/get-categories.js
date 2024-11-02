import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getCategories(hasProductType=false) {
    const endpoint = paths.CATEGORY.GET_CATEGORIES;
    const query = { hasProductType }

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};