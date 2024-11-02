import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteProductTypeField(id) {
    const endpoint = paths.PRODUCT_TYPE_FIELD.DELETE_PRODUCT_TYPE_FIELD + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, null, null, true);
    return result;
};