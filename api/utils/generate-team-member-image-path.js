const getRootPath = require("./get-root-path");

const generateTeamMemberImagePath = (fileName) => {
    return getRootPath() + '/static/team-member/' + fileName;
};

module.exports = generateTeamMemberImagePath;