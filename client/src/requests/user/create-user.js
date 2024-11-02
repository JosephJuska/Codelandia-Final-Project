import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createUser(firstName, lastName, username, email, password, roleID, isActive, isVerified, adminPassword) {
    const endpoint = paths.USER.CREATE_USER;
    const data = { firstName, lastName, username, email, password, roleID, isActive, isVerified, adminPassword };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};