import paths from "../../utils/constants/paths";
import makeRequest from '../../utils/make-request';
import METHODS from '../../utils/constants/methods';

export default async function getTeamMemberByID(id) {
    const endpoint = paths.TEAM_MEMBER.GET_TEAM_MEMBER_BY_ID + '/' + id;

    const result = await makeRequest(endpoint, METHODS.GET, null, {}, {}, true);
    return result
};