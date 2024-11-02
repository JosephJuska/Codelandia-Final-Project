const orm = require("../database/orm")
const queries = require("../database/queries");
const User = require("../model/User");
const Writer = require("../model/Writer");
const databaseResultHasData = require("../utils/database-has-data");

const getAccountDetailsWriter = async (id) => {
    let result = await orm.makeRequest(queries.USER.GET_WRITER_DETAILS, [id]);
    if(databaseResultHasData(result)) result.data = Writer.parseOne(result.data.rows[0]);
    else result.data = null;

    return result;
};

const getUserByEmail = async (email, isActive = null, isVerified = null, roleID = null, safe = true) => {
    let result = await orm.makeRequest(queries.USER.getUserByEmail(isVerified, isActive, roleID), [email]);
    if(databaseResultHasData(result)) result.data = User.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

const getUserByUsernameOrEmail = async (email, roleID) => {
    let result = await orm.makeRequest(queries.USER.GET_USER_BY_USERNAME_OR_EMAIL, [email, roleID]);
    if(databaseResultHasData(result)) result.data = User.parseOne(result.data.rows[0], false);
    else result.data = null;

    return result;
};

const getUsers = async (adminID, isActive, isVerified, roles, searchTerm, sortBy, limit, offset) => {
    let result = await orm.makeRequest(queries.USER.GET_USERS, [adminID, isActive, isVerified, roles, searchTerm, sortBy, limit, offset]);
    if(databaseResultHasData(result)){
        result.data = { pageCount: result.data.rows[0].page_count, users: User.parseMany(result.data.rows, false)};
    }else result.data = null;

    return result;
};

const getOwners = async () => {
    let result = await orm.makeRequest(queries.USER.GET_OWNERS, []);
    if(databaseResultHasData(result)) result.data = User.parseMany(result.data.rows, false);
    else result.data = null;

    return result;
};

const getUserByID = async (id, verified = null, isActive = null, safe = true) => {
    let result = await orm.makeRequest(queries.USER.getUserByID(verified, isActive), [id]);
    if(databaseResultHasData(result)) result.data = User.parseOne(result.data.rows[0], safe);
    else result.data = null;

    return result;
};

const createUser = async (firstName, lastName, username, email, password, roleID, verified = false, isActive = true) => {
    let result = await orm.makeRequest(queries.USER.CREATE_USER, [firstName, lastName, username, email, password, roleID, verified, isActive]);
    if(databaseResultHasData(result)) result.data = result.data.rows[0].id;
    return result;
};

const deleteUser = async (id) => {
    let result = await orm.makeRequest(queries.USER.DELETE_USER, [id]);
    return result;
};

const verifyAndUpdateEmail = async (userID, token) => {
    let result = await orm.makeRequest(queries.USER.VERIFY_AND_UPDATE_EMAIL, [userID, token]);
    return result;
};

const verifyAndUpdateAccount = async (userID, token) => {
    let result = await orm.makeRequest(queries.USER.VERIFY_AND_UPDATE_ACCOUNT, [userID, token]);
    return result;
};

const verifyAndUpdatePassword = async (userID, token, password) => {
    let result = await orm.makeRequest(queries.USER.VERIFY_AND_UPDATE_PASSWORD, [userID, token, password]);
    return result;
};

const updateAccount = async (userID, firstName, lastName, username, email, password, roleID, isVerified, isActive) => {
    let result = await orm.makeRequest(queries.USER.UPDATE_ACCOUNT, [userID, firstName, lastName, username, email, password, roleID, isVerified, isActive]);
    return result;
};

const clearUnverifiedUsers = async () => {
    let result = await orm.makeRequest(queries.USER.CLEAR_UNVERIFIED_USERS, []);
    if(databaseResultHasData(result)) result.data = result.data.rows[0].affected_count;
    else result.data = null;

    return result;
};

module.exports = {
    getUserByEmail,
    getUserByID,
    getUserByUsernameOrEmail,
    getAccountDetailsWriter,
    getUsers,
    getOwners,

    createUser,

    verifyAndUpdateEmail,
    verifyAndUpdateAccount,
    verifyAndUpdatePassword,

    deleteUser,
    updateAccount,

    clearUnverifiedUsers
};