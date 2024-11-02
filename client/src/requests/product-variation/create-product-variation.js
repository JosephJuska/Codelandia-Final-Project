import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createProductVariation(productItemID, name, stock, basePrice) {
    const endpoint = paths.PRODUCT_VARIATION.CREATE_PRODUCT_VARIATION;
    const data = { productItemID, name, stock, basePrice };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};