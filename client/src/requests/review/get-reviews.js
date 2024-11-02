import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getReviews(searchTerm, sortBy, productID, page) {
    const endpoint = paths.REVIEW.GET_REVIEWS;
    const query = { sortBy, searchTerm, productID, page };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};