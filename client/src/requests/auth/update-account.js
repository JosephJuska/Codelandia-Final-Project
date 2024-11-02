import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateAccount (firstName, lastName, username, newPassword, password) {
    const endpoint = paths.USER.UPDATE_ACCOUNT;

    const result = await makeRequest(endpoint, METHODS.PUT, { firstName, lastName, username, newPassword, password }, {}, {}, true);
    return result;
};