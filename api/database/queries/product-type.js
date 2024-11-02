const GET_PRODUCT_TYPE_BY_ID = 'select * from get_product_type_by_id($1)';

const GET_PRODUCT_TYPES = 'select * from get_product_types($1, $2)';

const GET_PRODUCT_TYPE_BY_CATEGORY_ID = 'select * from get_product_type_by_category_id($1)';

const SEARCH_PRODUCT_TYPES_BY_NAME = 'select * from search_product_types_by_name($1, $2, $3)';

const CREATE_PRODUCT_TYPE = 'select create_product_type($1) as id';

const UPDATE_PRODUCT_TYPE = 'call update_product_type($1, $2)';

const DELETE_PRODUCT_TYPE = 'call delete_product_type($1)';

const GET_PRODUCT_TYPE_FIELD_BY_ID = 'select * from product_type_fields where deleted = 0 and id = $1';

const CREATE_PRODUCT_TYPE_FIELD = 'select create_product_type_field($1, $2, $3) as id';

const UPDATE_PRODUCT_TYPE_FIELD = 'call update_product_type_field($1, $2, $3)';

const DELETE_PRODUCT_TYPE_FIELD = 'call delete_product_type_field($1)';

module.exports = {
    GET_PRODUCT_TYPES,
    GET_PRODUCT_TYPE_BY_CATEGORY_ID,
    GET_PRODUCT_TYPE_BY_ID,
    SEARCH_PRODUCT_TYPES_BY_NAME,

    CREATE_PRODUCT_TYPE,

    UPDATE_PRODUCT_TYPE,

    DELETE_PRODUCT_TYPE,

    GET_PRODUCT_TYPE_FIELD_BY_ID,

    CREATE_PRODUCT_TYPE_FIELD,

    UPDATE_PRODUCT_TYPE_FIELD,

    DELETE_PRODUCT_TYPE_FIELD
};