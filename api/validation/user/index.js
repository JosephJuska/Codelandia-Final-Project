const validateBoolean = require("../boolean");
const validateEmail = require("../email");
const validateID = require("../id");
const validateName = require("../user-name");
const validatePassword = require("../user-password");
const validateUsername = require("../username");

const validateUserUpdate = (firstName, lastName, email, password, username, roleID, isVerified, isActive, adminPassword) => {
    return {
        firstName: [firstName, async () => {return await validateName(firstName, 'firstName')}],
        lastName: [lastName, async () => {return await validateName(lastName, 'lastName')}],
        email: [email, validateEmail],
        password: [password, async () => {return await validatePassword(password, false)}],
        username: [username, async () => {return await validateUsername(username, false)}],
        roleID: [roleID, validateID],
        isVerified: [isVerified, async () => {return await validateBoolean(isVerified, 'verified', false)}],
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive', false)}],
        adminPassword: [adminPassword, validatePassword]
    }
};

const validateAccountUpdate = (firstName, lastName, username, newPassword, password) => {
    return {
        firstName: [firstName, async () => {return await validateName(firstName, 'firstName')}],
        lastName: [lastName, async () => {return await validateName(lastName, 'lastName')}],
        username: [username, async () => {return await validateUsername(username, false)}],
        newPassword: [newPassword, async () => {return await validatePassword(newPassword, false)}],
        password: [password, async () => {return await validatePassword(password)}]
    }
};  

const validateEmailUpdate = (email, password) => {
    return {
        password: [password, validatePassword],
        email: [email, validateEmail]
    }
};

module.exports = {
    validateEmailUpdate,
    validateAccountUpdate,
    validateUserUpdate
};