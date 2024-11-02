import  paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function confirmResetPassword(token) {
    const endpoint = paths.VERIFY.CONFIRM_RESET_PASSWORD + '/' + token;
    
    const result = await makeRequest(endpoint, METHOD.GET);
    return result;
};