import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function updateAnnouncement(id, title, startDate, endDate, isActive) {
    const endpoint = paths.ANNOUNCEMENT.UPDATE_ANNOUNCEMENT + '/' + id;
    const data = { title, startDate, endDate, isActive };

    const result = await makeRequest(endpoint, METHODS.PUT, data, null, null, true);
    return result;
};