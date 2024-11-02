import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteProduct(id) {
    const endpoint = paths.PRODUCT.DELETE_PRODUCT + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, null, null, true);
    return result;
};