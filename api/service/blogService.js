const orm = require("../database/orm");
const queries = require("../database/queries");
const Blog = require("../model/Blog");
const databaseResultHasData = require("../utils/database-has-data");

const getBlogByID = async (id, safe = true) => {
    const result = await orm.makeRequest(queries.BLOG.GET_BLOG_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = Blog.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

const getBlogs = async (published, sortBy, owners, title, limit, offset, safe = true) => {
    const result = await orm.makeRequest(queries.BLOG.GET_BLOGS, [published, sortBy, owners, title, limit, offset]);
    if(databaseResultHasData(result)) {
        result.data = { pageCount: result.data.rows[0].page_count, blogs: Blog.parseMany(result.data.rows, safe) }
    }else result.data = null;

    return result;
};

const getBlogsList = async () => {
    const result = await orm.makeRequest(queries.BLOG.GET_BLOGS_LIST, []);
    if(databaseResultHasData(result)) result.data = Blog.parseMany(result.data.rows, false);
    else result.data = null;

    return result;
};

const getBlogBySlug= async (slug, safe = true) => {
    const result = await orm.makeRequest(queries.BLOG.GET_BLOG_BY_SLUG, [slug]);
    if(databaseResultHasData(result)) result.data = Blog.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

const createBlog = async (authorID, title, slug, bannerPath, description, subDescription, rawContent, content, published) => {
    const result = await orm.makeRequest(queries.BLOG.CREATE_BLOG, [authorID, title, slug, bannerPath, description, subDescription, rawContent, content, published]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateBlog = async (blogID, authorID, roleID, title, slug, bannerPath, description, subDescription, rawContent, content, published) => {
    const result = await orm.makeRequest(queries.BLOG.UPDATE_BLOG, [blogID, authorID, roleID, title, slug, bannerPath, description, subDescription, rawContent, content, published]);
    return result;
}

const deleteBlogByID = async (id, userID) => {
    const result = await orm.makeRequest(queries.BLOG.DELETE_BLOG_BY_ID, [id, userID]);
    return result;
};

module.exports = {
    getBlogByID,
    getBlogs,
    getBlogBySlug,
    getBlogsList,

    createBlog,

    updateBlog,

    deleteBlogByID
};