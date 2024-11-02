const getRootPath = require("./get-root-path");

const generateBannerBackgroundPath = (fileName) => {
    return getRootPath() + '/static/banner/' + fileName;
};

module.exports = generateBannerBackgroundPath;