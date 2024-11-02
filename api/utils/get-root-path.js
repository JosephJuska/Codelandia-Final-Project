const path = require('path');

const getRootPath = () => {
    return path.resolve(__dirname, '../');
};

module.exports = getRootPath;