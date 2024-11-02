import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateProductVariationField(id, productTypeFieldID, value) {
    const endpoint = paths.PRODUCT_VARIATION_FIELD.UPDATE_PRODUCT_VARIATION_FIELD + '/' + id;
    const data = { productTypeFieldID, value };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};