import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateProductVariation(id, name, stock, basePrice) {
    const endpoint = paths.PRODUCT_VARIATION.UPDATE_PRODUCT_VARIATION + '/' + id;
    const data = { name, stock, basePrice };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};