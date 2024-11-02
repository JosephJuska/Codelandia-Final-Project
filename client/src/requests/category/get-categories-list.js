import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getCategoriesList() {
    const endpoint = paths.CATEGORY.GET_CATEGORIES_LIST;

    const result = await makeRequest(endpoint, METHODS.GET, null, null, null, true);
    return result;
};