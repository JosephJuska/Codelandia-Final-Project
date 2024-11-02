import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createDiscount(startDate, endDate, productID, categoryID, brandID, productTypeID, discountPercentage, isActive) {
    const endpoint = paths.DISCOUNT.CREATE_DISCOUNT;
    const data = { startDate, endDate, productID, categoryID, brandID, productTypeID, discountPercentage, isActive };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};