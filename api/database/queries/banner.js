const CREATE_BANNER = 'select create_banner($1, $2, $3, $4, $5, $6, $7) as id';
const UPDATE_BANNER = 'call update_banner($1, $2, $3, $4, $5, $6, $7, $8)';
const DELETE_BANNER = 'call delete_banner($1)';
const GET_BANNERS = 'select * from get_banners($1, $2, $3, $4)';
const GET_BANNER_BY_ID = 'select * from get_banner_by_id($1)';

module.exports = {
    CREATE_BANNER,
    UPDATE_BANNER,
    DELETE_BANNER,
    GET_BANNERS,
    GET_BANNER_BY_ID
}