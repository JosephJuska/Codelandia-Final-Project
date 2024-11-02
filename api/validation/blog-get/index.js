const validateBlogPublished = require("../blog/blog-published");
const validateBlogTitle = require("../blog/blog-title");
const validatePage = require("../page");
const validateBlogOwners = require("./blog-owners");
const validateBlogSort = require("./blog-sort-by");

const validateBlogGet = (page, published, sortBy, owners, id, title) => {
    return {
        page: [page, validatePage],
        published: [published, async () => {return await validateBlogPublished(published, false)}],
        sortBy: [sortBy, validateBlogSort],
        owners: [owners, async () => {return await validateBlogOwners(owners, id)}],
        title: [title, async () => {return await validateBlogTitle(title, false)}]   
    }
};

const validateBlogGetByTitle = (page, title) => {
    return {
        page: [page, validatePage],
        title: [title, validateBlogTitle]
    }
};

module.exports = {
    validateBlogGet,
    validateBlogGetByTitle
};