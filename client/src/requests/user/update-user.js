import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateUser(id, username, firstName, lastName, email, password, roleID, isActive, isVerified, adminPassword) {
    const endpoint = paths.USER.UPDATE_USER + '/' + id;
    const data = { username, firstName, lastName, email, password, roleID, isActive, isVerified, adminPassword };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};