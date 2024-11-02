import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getProductsList() {
    const endpoint = paths.PRODUCT.GET_PRODUCTS_LIST;

    const result = await makeRequest(endpoint, METHODS.GET, null, null, null, true);
    return result;
};