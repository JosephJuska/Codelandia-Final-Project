import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function getBlogByID(id) {
    const endpoint = paths.BLOG.GET_BLOG_BY_ID + '/' + id;

    return await makeRequest(endpoint, METHOD.GET, null, {}, {}, true);
};