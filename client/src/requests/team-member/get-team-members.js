import paths from "../../utils/constants/paths";
import makeRequest from '../../utils/make-request';
import METHODS from '../../utils/constants/methods';

export default async function getTeamMembers() {
    const endpoint = paths.TEAM_MEMBER.GET_TEAM_MEMBERS;

    const result = await makeRequest(endpoint, METHODS.GET, null, {}, {}, true);
    return result
};