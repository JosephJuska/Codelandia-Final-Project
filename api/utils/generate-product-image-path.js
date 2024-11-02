const getRootPath = require("./get-root-path");

const generateProductImagePath = (fileName) => {
    return getRootPath() + '/static/product/' + fileName;
};

module.exports = generateProductImagePath;