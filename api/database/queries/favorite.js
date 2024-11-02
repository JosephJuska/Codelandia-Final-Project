const CREATE_FAVORITE = 'select create_favorite($1, $2) as id';
const DELETE_FAVORITE = 'call delete_favorite($1, $2)';

const GET_FAVORITES = 'select * from get_favorites($1, $2, $3)';

module.exports = {
    CREATE_FAVORITE,
    DELETE_FAVORITE,
    GET_FAVORITES,
};