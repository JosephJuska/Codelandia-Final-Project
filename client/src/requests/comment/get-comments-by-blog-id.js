import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function getCommentsByID(id, searchTerm, sortBy, page) {
    const endpoint = paths.COMMENT.GET_COMMENTS_BY_BLOG_ID;
    const query = { id, searchTerm, sortBy, page };

    return await makeRequest(endpoint, METHOD.GET, null, null, query, true);
};