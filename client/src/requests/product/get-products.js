import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getProducts(isActive, searchTerm, sortBy, startPrice, endPrice, hasDiscount, categoryID, brandID, page) {
    const endpoint = paths.PRODUCT.GET_PRODUCTS;
    const query = { isActive, sortBy, searchTerm, startPrice, endPrice, hasDiscount, categoryID, brandID, page };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};