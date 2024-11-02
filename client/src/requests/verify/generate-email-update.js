import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function generateEmailUpdate(email, password) {
    const endpoint = paths.VERIFY.GENERATE_EMAIL_UPDATE;

    const result = await makeRequest(endpoint, METHODS.POST, { email: email, password: password }, {}, {}, true);
    return result;
};