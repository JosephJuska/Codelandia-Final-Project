import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteUser(id, adminPassword) {
    const endpoint = paths.USER.DELETE_USER + '/' + id;

    const data = { adminPassword }

    const result = await makeRequest(endpoint, METHODS.DELETE, data, null, null, true);
    return result;
};