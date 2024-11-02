import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getProductByID(id) {
    const endpoint = paths.PRODUCT.GET_PRODUCT_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.GET, null, null, null, true);
    return result;
};