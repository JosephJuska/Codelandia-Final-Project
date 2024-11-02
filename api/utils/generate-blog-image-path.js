const getRootPath = require("./get-root-path");

const generateBlogImagePath = (fileName, type) => {
    return getRootPath() + '/static/blog/' + type + '/' + fileName;
};

module.exports = generateBlogImagePath;