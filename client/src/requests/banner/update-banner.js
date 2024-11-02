import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import CONTENT_TYPES from "../../utils/constants/content-types";

export default async function updateBanner(id, formData) {
    const endpoint = paths.BANNER.UPDATE_BANNER + '/' + id;

    const result = await makeRequest(endpoint, METHODS.PUT, formData, {'Content-Type':CONTENT_TYPES.MULTIPART_FORM}, {}, true);
    return result;
};