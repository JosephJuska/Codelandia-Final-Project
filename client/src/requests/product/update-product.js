import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateProduct(id, name, description, sku, brandID, categoryID, basePrice, fields, isActive) {
    const endpoint = paths.PRODUCT.UPDATE_PRODUCT + '/' + id;
    const data = { name, description, sku, brandID, categoryID, basePrice, fields, isActive };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};