const GET_BRANDS = 'select * from get_brands($1, $2, $3, $4)';

const GET_BRAND_BY_ID = 'select * from get_brand_by_id($1)';

const CREATE_BRAND = 'select create_brand($1, $2, $3) as id';

const UPDATE_BRAND = 'call update_brand($1, $2, $3, $4)';

const DELETE_BRAND = 'call delete_brand($1)';

module.exports = {
    GET_BRAND_BY_ID,
    GET_BRANDS,
    CREATE_BRAND,
    UPDATE_BRAND,
    DELETE_BRAND
};