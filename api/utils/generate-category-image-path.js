const getRootPath = require("./get-root-path");

const generateCategoryImagePath = (fileName) => {
    return getRootPath() + '/static/category/' + fileName;
};

module.exports = generateCategoryImagePath;