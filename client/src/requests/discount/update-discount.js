import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateDiscount(id, startDate, endDate, productID, categoryID, brandID, productTypeID, discountPercentage, isActive) {
    const endpoint = paths.DISCOUNT.UPDATE_DISCOUNT + '/' + id;
    const data = { startDate, endDate, productID, categoryID, brandID, productTypeID, discountPercentage, isActive };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};