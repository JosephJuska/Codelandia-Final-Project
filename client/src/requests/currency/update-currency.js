import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateCurrency(azn, eur, tr) {
    const endpoint = paths.CURRENCY.UPDATE_CURRENCY;

    const data = { azn, eur, try: tr };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, {}, true);
    return result;
};