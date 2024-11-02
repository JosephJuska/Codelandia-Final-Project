import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";

export default async function getAnnouncements(isActive, searchTerm, sortBy, startDate, endDate, page) {
    const endpoint = paths.ANNOUNCEMENT.GET_ANNOUNCEMENTS;
    const query = { isActive, searchTerm, sortBy, startDate, endDate, page };

    const result = await makeRequest(endpoint, METHODS.GET, null, null, query, true);
    return result;
};