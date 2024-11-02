import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateProductTypeField(id, name, fieldTypeID) {
    const endpoint = paths.PRODUCT_TYPE_FIELD.UPDATE_PRODUCT_TYPE_FIELD + '/' + id;
    const data = { name, fieldTypeID };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};