import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getDiscounts(isActive, sortBy, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, page) {
    const endpoint = paths.DISCOUNT.GET_DISCOUNTS;
    const query = { isActive, sortBy, startDate, endDate, startPercentage, endPercentage, isProduct, isCategory, isBrand, isProductType, page };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};