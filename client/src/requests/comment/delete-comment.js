import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function deleteComment(id) {
    const endpoint = paths.COMMENT.DELETE_COMMENT + '/' + id;

    return await makeRequest(endpoint, METHOD.DELETE, null, {}, {}, true);
};