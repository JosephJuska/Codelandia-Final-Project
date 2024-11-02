import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createProductVariationField(productVariationID, productTypeFieldID, value) {
    const endpoint = paths.PRODUCT_VARIATION_FIELD.CREATE_PRODUCT_VARIATION_FIELD;
    const data = { productVariationID, productTypeFieldID, value };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};