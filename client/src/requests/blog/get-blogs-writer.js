import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function getBlogsWriter(published, sortBy, page, title) {
    const endpoint = paths.BLOG.GET_BLOGS_WRITER;
    const query = { published, sortBy, page, title };

    return await makeRequest(endpoint, METHOD.GET, null, null, query, true);
};