const CREATE_TEAM_MEMBER = 'select create_team_member($1, $2, $3, $4, $5, $6, $7, $8, $9) as id';

const UPDATE_TEAM_MEMBER = 'call update_team_member($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';

const DELETE_TEAM_MEMBER = 'call delete_team_member($1)';

const GET_TEAM_MEMBERS = 'select * from get_team_members()';

const GET_TEAM_MEMBER_BY_ID = 'select * from get_team_member_by_id($1)';

module.exports = {
    CREATE_TEAM_MEMBER,
    UPDATE_TEAM_MEMBER,
    DELETE_TEAM_MEMBER,
    GET_TEAM_MEMBERS,
    GET_TEAM_MEMBER_BY_ID
};