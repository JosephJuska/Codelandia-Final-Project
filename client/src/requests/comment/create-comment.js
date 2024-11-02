import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function createComment(name, email, content, id) {
    const endpoint = paths.COMMENT.CREATE_COMMENT;

    return await makeRequest(endpoint, METHOD.POST, { name, email, content, id }, {}, {}, true);
};