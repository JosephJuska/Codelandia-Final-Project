import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function getBlogs(published, sortBy, page, title, owners=null) {
    const endpoint = paths.BLOG.GET_BLOGS;
    const query = { published, sortBy, page, title, owners };

    return await makeRequest(endpoint, METHOD.GET, null, null, query, true);
};