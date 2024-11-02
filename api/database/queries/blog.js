const GET_BLOG_BY_ID = 'select * from get_blog_by_id($1)';

const GET_BLOGS = 'select * from get_blogs($1, $2, $3, $4, $5, $6)';

const GET_BLOGS_LIST = 'select * from blogs where deleted = 0';

const GET_BLOG_BY_SLUG = 'select * from get_blog_by_slug($1)';

const CREATE_BLOG = 'select create_blog($1, $2, $3, $4, $5, $6, $7, $8, $9) as id';

const UPDATE_BLOG = 'call update_blog($1, $2, $3, $4, $5, $6, $7, $8, $9 ,$10, $11)';

const DELETE_BLOG_BY_ID = 'call delete_blog($1, $2)';

module.exports = {
    GET_BLOG_BY_ID,
    GET_BLOG_BY_SLUG,
    GET_BLOGS,
    GET_BLOGS_LIST,

    CREATE_BLOG,

    UPDATE_BLOG,

    DELETE_BLOG_BY_ID
};