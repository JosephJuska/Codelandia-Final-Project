import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createProductItem(productID, stock, colour1, colour2, colour3, imagePaths) {
    const endpoint = paths.PRODUCT_ITEM.CREATE_PRODUCT_ITEM;
    const data = { productID, stock, colour1, colour2, colour3, imagePaths };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};