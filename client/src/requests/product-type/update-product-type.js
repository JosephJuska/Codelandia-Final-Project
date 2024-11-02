import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateProductType(id, name) {
    const endpoint = paths.PRODUCT_TYPE.UPDATE_PRODUCT_TYPE + '/' + id;
    const data = { name };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};