const getRootPath = require("./get-root-path");

const generateBrandImagePath = (fileName) => {
    return getRootPath() + '/static/brand/' + fileName;
};

module.exports = generateBrandImagePath;