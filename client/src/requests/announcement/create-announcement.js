import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function createAnnouncement(title, startDate, endDate, isActive) {
    const endpoint = paths.ANNOUNCEMENT.CREATE_ANNOUNCEMENT;
    const data = { title, startDate, endDate, isActive };

    const result = await makeRequest(endpoint, METHODS.POST, data, null, null, true);
    return result;
};