import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function getBlogsList() {
    const endpoint = paths.BLOG.GET_BLOGS_LIST;

    return await makeRequest(endpoint, METHOD.GET, null, null, null, true);
};