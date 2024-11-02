const validateBlogBanner = require("./blog-banner");
const validateBlogContent = require("./blog-content");
const validateBlogDescription = require("./blog-description");
const validateBlogPublished = require("./blog-published");
const validateSubDescription = require("./blog-sub-description");
const validateBlogTitle = require("./blog-title");
const validateID = require("../id");

const validateBlog = (title, description, subDescription, content, published, bannerBuffer, authorID) => {
    return {
        title: [title, validateBlogTitle],
        description: [description, validateBlogDescription],
        subDescription: [subDescription, validateSubDescription],
        content: [content, validateBlogContent],
        published: [published, validateBlogPublished],
        banner: [bannerBuffer, validateBlogBanner],
        authorID: [authorID, async () => {return await validateID(authorID, false)}]
    };
};

const validateBlogUpdate = (title, description, subDescription, content, published, bannerBuffer, authorID) => {
    return {
        title: [title, validateBlogTitle],
        description: [description, validateBlogDescription],
        subDescription: [subDescription, validateSubDescription],
        content: [content, validateBlogContent],
        published: [published, validateBlogPublished],
        banner: [bannerBuffer, async() => {return await validateBlogBanner(bannerBuffer, false)}],
        authorID: [authorID, async () => {return await validateID(authorID, false)}]
    }
};

module.exports = {
    validateBlog,
    validateBlogUpdate
};