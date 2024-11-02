const orm = require("../database/orm");
const queries = require("../database/queries");
const TeamMember = require("../model/TeamMember");
const databaseResultHasData = require("../utils/database-has-data");

const createTeamMember = async (fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imagePath) => {
    const result = await orm.makeRequest(queries.TEAM_MEMBERS.CREATE_TEAM_MEMBER, [fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imagePath]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0];
    else result.data = null;
    return result;
};

const updateTeamMember = async (id, fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imagePath) => {
    const result = await orm.makeRequest(queries.TEAM_MEMBERS.UPDATE_TEAM_MEMBER, [id, fullName, jobPosition, shortDescription, facebookLink, twitterLink, youtubeLink, pinterestLink, instagramLink, imagePath]);
    return result;
};

const deleteTeamMember = async (id) => {
    const result = await orm.makeRequest(queries.TEAM_MEMBERS.DELETE_TEAM_MEMBER, [id]);
    return result;
};

const getTeamMembers = async (safe = true) => {
    const result = await orm.makeRequest(queries.TEAM_MEMBERS.GET_TEAM_MEMBERS, []);
    if(databaseResultHasData(result)) result.data = TeamMember.parseMany(result.data.rows, safe);
    else result.data = null;

    return result;
};

const getTeamMemberByID = async (id, safe = true) => {
    const result = await orm.makeRequest(queries.TEAM_MEMBERS.GET_TEAM_MEMBER_BY_ID, [id]);
    if(databaseResultHasData(result)) result.data = TeamMember.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

module.exports = {
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    getTeamMembers,
    getTeamMemberByID
};