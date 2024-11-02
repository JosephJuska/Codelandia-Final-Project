const CREATE_ANNOUNCEMENT = 'select create_announcement($1, $2, $3, $4) as id';
const UPDATE_ANNOUNCEMENT = 'call update_announcement($1, $2, $3, $4, $5)';
const DELETE_ANNOUNCEMENT = 'call delete_announcement($1)';

const GET_ANNOUNCEMENT_BY_ID = 'select * from get_announcement_by_id($1)';
const GET_ACTIVE_ANNOUNCEMENTS = 'select * from get_active_announcements()';
const GET_ANNOUNCEMENTS = 'select * from get_announcements($1, $2, $3, $4, $5, $6, $7)';

module.exports = {
    CREATE_ANNOUNCEMENT,
    UPDATE_ANNOUNCEMENT,
    DELETE_ANNOUNCEMENT,

    GET_ANNOUNCEMENT_BY_ID,
    GET_ACTIVE_ANNOUNCEMENTS,
    GET_ANNOUNCEMENTS
};