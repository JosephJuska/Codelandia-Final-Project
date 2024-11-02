import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getUsers(isActive, isVerified, roles, searchTerm, sortBy, page) {
    const endpoint = paths.USER.GET_USERS;
    const query = { isActive, isVerified, roles, searchTerm, sortBy,  page };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};