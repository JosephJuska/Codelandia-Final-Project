const CREATE_REVIEW = 'select create_review($1, $2, $3, $4, $5, $6) as id';
const DELETE_REVIEW = 'call delete_review($1)';

const GET_REVIEW_BY_ID = 'select * from get_review_by_id($1)';
const GET_REVIEWS = 'select * from get_reviews($1, $2, $3, $4, $5)';
const GET_REVIEWS_BY_PRODUCT_ID = 'select * from get_reviews_by_product_id($1, $2, $3, $4)';

module.exports = {
    CREATE_REVIEW,
    DELETE_REVIEW,

    GET_REVIEW_BY_ID,
    GET_REVIEWS,
    GET_REVIEWS_BY_PRODUCT_ID
};