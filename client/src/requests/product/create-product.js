import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createProduct(name, description, sku, brandID, categoryID, basePrice, fields) {
    const endpoint = paths.PRODUCT.CREATE_PRODUCT;
    const data = { name, description, sku, brandID, categoryID, basePrice, fields };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};