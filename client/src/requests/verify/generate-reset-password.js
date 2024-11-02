import  paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function generateResetPassword(email) {
    const endpoint = paths.VERIFY.GENERATE_RESET_PASSWORD;
    
    const result = await makeRequest(endpoint, METHOD.POST, { email: email });
    return result;
};