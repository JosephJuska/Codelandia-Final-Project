import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createProductType(name) {
    const endpoint = paths.PRODUCT_TYPE.CREATE_PRODUCT_TYPE;
    const data = { name };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};