const CREATE_CATEGORY = 'select create_category($1, $2, $3, $4, $5) as id';

const UPDATE_CATEGORY = 'call update_category($1, $2, $3, $4, $5, $6)';

const DELETE_CATEGORY = 'call delete_category($1)';

const GET_ALL_CATEGORIES = 'select * from get_all_categories($1)';

const GET_ALL_CATEGORIES_HIERARCHY = 'select * from get_all_categories_hierarchy()';

const GET_CATEGORY_BY_ID = 'select * from get_category_by_id($1)';

const GET_CATEGORY_BY_SLUG = 'select * from get_category_by_slug($1)';

module.exports = {
    CREATE_CATEGORY,

    UPDATE_CATEGORY,

    DELETE_CATEGORY,

    GET_ALL_CATEGORIES,
    GET_ALL_CATEGORIES_HIERARCHY,
    GET_CATEGORY_BY_ID,
    GET_CATEGORY_BY_SLUG
};