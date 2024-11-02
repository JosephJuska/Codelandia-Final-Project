import paths from "../../utils/constants/paths";
import makeRequest from '../../utils/make-request';
import METHODS from '../../utils/constants/methods';
import CONTENT_TYPES from "../../utils/constants/content-types";

export default async function createTeamMember(formData) {
    const endpoint = paths.TEAM_MEMBER.CREATE_TEAM_MEMBER;

    const result = await makeRequest(endpoint, METHODS.POST, formData, {'Content-Type':CONTENT_TYPES.MULTIPART_FORM}, {}, true);
    return result;
};