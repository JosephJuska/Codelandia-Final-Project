const validateBoolean = require("../boolean");
const validateEmail = require("../email");
const validateID = require("../id");
const validateName = require("../user-name");
const validatePassword = require('../user-password/');
const validateUsername = require("../username");


const validateRegister = (firstName, lastName, email, password) => {
    return {
        firstName: [firstName, async () => {return await validateName(firstName, 'firstName')}],
        lastName: [lastName, async () => {return await validateName(lastName, 'lastName')}],
        email: [email, validateEmail],
        password: [password, validatePassword]
    }
};

const validateRegisterAdmin = (firstName, lastName, email, password, username, roleID, verified, isActive, adminPassword) => {
    return {
        firstName: [firstName, async () => {return await validateName(firstName, 'firstName')}],
        lastName: [lastName, async () => {return await validateName(lastName, 'lastName')}],
        email: [email, validateEmail],
        password: [password, validatePassword],
        username: [username, async () => {return await validateUsername(username, false)}],
        roleID: [roleID, validateID],
        isVerified: [verified, async () => {return await validateBoolean(verified, 'verified', false)}],
        isActive: [isActive, async () => {return await validateBoolean(isActive, 'isActive', false)}],
        adminPassword: [adminPassword, validatePassword]
    }
};

module.exports = {
    validateRegister,
    validateRegisterAdmin
};