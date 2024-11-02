import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createProductTypeField(id, name, fieldTypeID) {
    const endpoint = paths.PRODUCT_TYPE_FIELD.CREATE_PRODUCT_TYPE_FIELD + '/' + id;
    const data = { name, fieldTypeID };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};