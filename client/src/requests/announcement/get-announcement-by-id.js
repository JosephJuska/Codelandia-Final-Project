import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getAnnouncementByID(id) {
    const endpoint = paths.ANNOUNCEMENT.GET_ANNOUNCEMENT_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.GET, null, null, null, true);
    return result;
};