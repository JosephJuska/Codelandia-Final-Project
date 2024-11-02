import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function deleteBlog(id) {
    const endpoint = paths.BLOG.DELETE_BLOG + '/' + id;

    return await makeRequest(endpoint, METHOD.DELETE, null, {}, {}, true);
};