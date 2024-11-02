import METHODS from "../../utils/constants/methods";
import paths from "../../utils/constants/paths";
import makeRequest from "../../utils/make-request";
import CONTENT_TYPES from "../../utils/constants/content-types";

export default async function updateTeamMember(id, formData) {
    const endpoint = paths.TEAM_MEMBER.GET_TEAM_MEMBER_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.PUT, formData, {'Content-Type':CONTENT_TYPES.MULTIPART_FORM}, {}, true);
    return result;
};