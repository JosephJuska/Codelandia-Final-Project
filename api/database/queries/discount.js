const CREATE_DISCOUNT = 'select create_discount($1, $2, $3, $4, $5, $6, $7, $8) as id';
const UPDATE_DISCOUNT = 'call update_discount($1, $2, $3, $4, $5, $6, $7, $8, $9)';
const DELETE_DISCOUNT = 'call delete_discount($1)';

const GET_DISCOUNT_BY_ID = 'select * from get_discount_by_id($1)';
const GET_DISCOUNTS = 'select * from get_discounts($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';

module.exports = {
    CREATE_DISCOUNT,
    UPDATE_DISCOUNT,
    DELETE_DISCOUNT,

    GET_DISCOUNT_BY_ID,
    GET_DISCOUNTS
};