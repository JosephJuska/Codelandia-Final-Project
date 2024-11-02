import paths from "../../utils/constants/paths";
import makeRequest from '../../utils/make-request';
import METHODS from '../../utils/constants/methods';

export default async function deleteTeamMember(id) {
    const endpoint = paths.TEAM_MEMBER.DELETE_TEAM_MEMBER + '/' + id;

    const result = await makeRequest(endpoint, METHODS.DELETE, null, {}, {}, true);
    return result
};