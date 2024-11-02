import paths from "../../utils/constants/paths";
import makeRequest from '../../utils/make-request';
import METHODS from '../../utils/constants/methods';
import CONTENT_TYPES from "../../utils/constants/content-types";

export default async function addBlogImage(image) {
    const endpoint = paths.BLOG.ADD_BLOG_IMAGE;
    const formData = new FormData();

    formData.append('image', image);

    const result = await makeRequest(endpoint, METHODS.POST, formData, {'Content-Type':CONTENT_TYPES.MULTIPART_FORM}, {}, true);
    return result;
};