import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteProductVariationField(id) {
    const endpoint = paths.PRODUCT_VARIATION_FIELD.DELETE_PRODUCT_VARIATION_FIELD + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, null, null, true);
    return result;
};