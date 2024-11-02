import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getProductTypeByID(id) {
    const endpoint = paths.PRODUCT_TYPE.GET_PRODUCT_TYPE_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.GET, null, null, null, true);
    return result;
};