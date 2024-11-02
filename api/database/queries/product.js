const CREATE_PRODUCT = 'select create_product($1, $2, $3, $4, $5, $6, $7, $8) as id';
const UPDATE_PRODUCT = 'call update_product($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
const DELETE_PRODUCT = 'call delete_product($1)';

const CREATE_PRODUCT_ITEM = 'select create_product_item($1, $2, $3, $4, $5, $6) as id';
const UPDATE_PRODUCT_ITEM = 'call update_product_item($1, $2, $3, $4, $5, $6)';
const DELETE_PRODUCT_ITEM = 'call delete_product_item($1)';

const CREATE_PRODUCT_VARIATION = 'select create_product_variation($1, $2, $3, $4) as id';
const UPDATE_PRODUCT_VARIATION = 'call update_product_variation($1, $2, $3, $4)';
const DELETE_PRODUCT_VARIATION = 'call delete_product_variation($1)';

const CREATE_PRODUCT_VARIATION_FIELD = 'select create_product_variation_field($1, $2, $3) as id';
const UPDATE_PRODUCT_VARIATION_FIELD = 'call update_product_variation_field($1, $2, $3)';
const DELETE_PRODUCT_VARIATION_FIELD = 'call delete_product_variation_field($1)';

const GET_PRODUCTS_LIST = 'select name as product_name, id as product_id, created_at as product_created_at from products where deleted = 0';
const GET_PRODUCTS = 'select * from get_products($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
const GET_PRODUCT_BY_ID = 'select * from get_product_by_id($1, $2)';

module.exports = {
    CREATE_PRODUCT,
    UPDATE_PRODUCT,
    DELETE_PRODUCT,

    CREATE_PRODUCT_ITEM,
    UPDATE_PRODUCT_ITEM,
    DELETE_PRODUCT_ITEM,

    CREATE_PRODUCT_VARIATION,
    UPDATE_PRODUCT_VARIATION,
    DELETE_PRODUCT_VARIATION,

    CREATE_PRODUCT_VARIATION_FIELD,
    UPDATE_PRODUCT_VARIATION_FIELD,
    DELETE_PRODUCT_VARIATION_FIELD,

    GET_PRODUCTS,
    GET_PRODUCTS_LIST,
    GET_PRODUCT_BY_ID
};