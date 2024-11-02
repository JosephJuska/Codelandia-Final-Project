import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import CONTENT_TYPES from "../../utils/constants/content-types";

export default async function updateCategory(id, formData) {
    const endpoint = paths.CATEGORY.UPDATE_CATEGORY + '/' + id;

    const result = await makeRequest(endpoint, METHODS.PUT, formData, {'Content-Type':CONTENT_TYPES.MULTIPART_FORM}, {}, true);
    return result;
};