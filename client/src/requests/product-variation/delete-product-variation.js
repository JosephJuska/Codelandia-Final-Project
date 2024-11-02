import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteProductVariation(id) {
    const endpoint = paths.PRODUCT_VARIATION.DELETE_PRODUCT_VARIATION + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, null, null, true);
    return result;
};