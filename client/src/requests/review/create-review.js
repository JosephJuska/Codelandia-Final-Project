import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createReview(name, email, title, review, productID, description) {
    const endpoint = paths.REVIEW.CREATE_REVIEW;

    const result = await makeRequest(endpoint, METHODS.POST, { name, email, title, review, productID, description }, null, null, true);
    return result;
};