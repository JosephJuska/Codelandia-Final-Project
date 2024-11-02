import  paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import METHOD from '../../utils/constants/methods';

export default async function resetPassword(token, password) {
    const endpoint = paths.VERIFY.RESET_PASSWORD + '/' + token;
    
    const result = await makeRequest(endpoint, METHOD.POST, { password: password });
    return result;
};