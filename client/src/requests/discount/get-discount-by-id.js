import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getDiscountByID(id) {
    const endpoint = paths.DISCOUNT.GET_DISCOUNT_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.GET, null, null, null, true);
    return result;
};