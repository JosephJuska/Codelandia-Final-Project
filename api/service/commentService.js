const orm = require("../database/orm");
const queries = require("../database/queries");
const databaseResultHasData = require("../utils/database-has-data");

const Comment = require('../model/Comment');

const createComment = async (name, email, content, blogID) => {
    const result = await orm.makeRequest(queries.COMMENT.CREATE_COMMENT, [name, email, content, blogID]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const getComments = async (blogID, searchTerm, sortBy, limit, offset, blog_published = null, safe = true) => {
    const result = await orm.makeRequest(queries.COMMENT.GET_COMMENTS, [blogID, searchTerm, sortBy, limit, offset, blog_published]);
    if(databaseResultHasData(result)) {
        result.data = { pageCount: result.data.rows[0].page_count, comments: Comment.parseMany(result.data.rows, safe) };
    }else result.data = null;

    return result;
};

const deleteComment = async (commentID) => {
    const result = await orm.makeRequest(queries.COMMENT.DELETE_COMMENT, [commentID]);
    return result;
};

module.exports = {
    createComment,

    deleteComment,

    getComments
};