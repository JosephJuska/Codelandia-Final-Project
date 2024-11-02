import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getBrandsPublic() {
    const endpoint = paths.BRAND.GET_BRANDS;

    const result = await makeRequest(endpoint, METHODS.GET, null, null, null, false);
    return result;
};