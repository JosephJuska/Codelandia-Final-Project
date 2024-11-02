import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function deleteAnnouncement(id) {
    const endpoint = paths.ANNOUNCEMENT.DELETE_ANNOUNCEMENT + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, null, null, true);
    return result;
};