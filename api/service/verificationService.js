const orm = require("../database/orm");
const queries = require("../database/queries");
const Verification = require("../model/Verification");
const databaseResultHasData = require("../utils/database-has-data");

const createVerification = async (userID, token, isAccount = false, isPassword = false, isEmail = false, isDeletion = false, newEmail = null) => {
    const result = await orm.makeRequest(queries.VERIFICATION.CREATE_VERIFICATION, [userID, token, isAccount, isPassword, isEmail, isDeletion, newEmail]);
    return result;
};

const getVerification = async (userID, token, isAccount = null, isPassword = null, isEmail = null, isExpired = null, isConfirmed = null) => {
    const result = await orm.makeRequest(queries.VERIFICATION.getVerification(isAccount, isPassword, isEmail, isExpired, isConfirmed), [userID, token]);
    if(databaseResultHasData(result)) result.data = Verification.parseOne(result.data.rows[0]);
    else result.data = null;

    return result;
}; 

const getVerificationCount = async (isAccount = null, isPassword = null, isEmail = null, isDeleted = null) => {
    const result = await orm.makeRequest(queries.VERIFICATION.getVerificationCount(isAccount, isPassword, isEmail, isDeleted));
    if(databaseResultHasData(result)) result.data = result.data.rows[0].count;
    else result.data = null;

    return result;
};

module.exports = {
    createVerification,

    getVerification,

    getVerificationCount
};