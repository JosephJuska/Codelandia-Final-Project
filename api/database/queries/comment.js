const CREATE_COMMENT = 'select create_comment($1, $2, $3, $4) as id';

const DELETE_COMMENT = 'call delete_comment($1)';

const GET_COMMENTS = 'select * from get_comments($1, $2, $3, $4, $5, $6)';

module.exports = {
    CREATE_COMMENT,

    DELETE_COMMENT,

    GET_COMMENTS
};