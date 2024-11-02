const userService = require('../service/userService');
const { generate500ServerError, generate404NotFound, generate401Unauthorized, generate200OK, generate400BadRequest, generateDatabaseErrorResponse, generate202Accepted, generate201Created, generate204NoContent } = require('../utils/response-generator');
const { validateAccountUpdate, validateUserUpdate } = require('../validation/user');
const massValidator = require('../validation/mass-validator');
const { comparePassword, hashPassword } = require('../utils/password');

const errorMessages = require('../utils/error-messages');
const validateUserGet = require('../validation/user-get');

const { LIMIT } = require('../config/api');
const { validateRegisterAdmin } = require('../validation/register');
const { generateVerificationToken } = require('../utils/token');

const verificationService = require('../service/verificationService');
const { scheduleAccountVerificationEmail } = require('../cronjob/agenda');
const validateID = require('../validation/id');
const validatePassword = require('../validation/user-password');

const getUsers = async (req, res) => {
    const isActiveP = req.query.isActive;
    const isVerifiedP = req.query.isVerified;
    let rolesP = req.query.roles;
    const searchTermP = req.query.searchTerm;
    const sortByP = req.query.sortBy || 'newest';
    const pageP = req.query.page || 1;

    if (rolesP && typeof rolesP === 'string') rolesP = rolesP.split(',').map(role => role.trim());

    const validationObject = validateUserGet(isActiveP, isVerifiedP, rolesP, searchTermP, sortByP, pageP);
    const validationResult = await massValidator(validationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { isActive, isVerified, roles, searchTerm, sortBy, page } = validationResult.data;

    const limit = LIMIT;
    const offset = (page - 1) * limit;

    const getUsersResult = await userService.getUsers(req.userID, isActive, isVerified, roles, searchTerm, sortBy, limit, offset);
    if(!getUsersResult.success) return generateDatabaseErrorResponse(res, getUsersResult);
    
    return generate200OK(res, getUsersResult.data);
};

const getOwnersProtected = async (req, res) => {
    const ownersResult = await userService.getOwners(req.userID);
    if(!ownersResult.success) return generateDatabaseErrorResponse(res, ownersResult);

    return generate200OK(res, ownersResult.data);
};

const getUserByID = async (req, res) => {
    const idP = req.params?.id;
    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.USER_NOT_FOUND);
    
    const id = idValidationResult.data;
    
    const getUserResult = await userService.getUserByID(id, null, null, false);
    if(!getUserResult.success) return generate500ServerError(res, getUserResult);
    if(!getUserResult.data) return generate404NotFound(res, errorMessages.USER_NOT_FOUND);

    delete getUserResult.data.password;

    return generate200OK(res, getUserResult.data);
};

const createUser = async (req, res) => {
    const usernameP = req.body?.username;
    const firstNameP = req.body?.firstName;
    const lastNameP = req.body?.lastName;
    const emailP = req.body?.email;
    const passwordP = req.body?.password;
    const roleIDP = req.body?.roleID;
    const isActiveP = req.body?.isActive;
    const isVerifiedP = req.body?.isVerified;
    const adminPasswordP = req.body?.adminPassword;

    const validationObject = validateRegisterAdmin(firstNameP, lastNameP, emailP, passwordP, usernameP, roleIDP, isVerifiedP, isActiveP, adminPasswordP);
    const validationResult = await massValidator(validationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { firstName, lastName, email, password, username, roleID, isActive, isVerified, adminPassword } = validationResult.data;

    const getUserResult = await userService.getUserByID(req.userID, true, true, false);
    if(!getUserResult.success) return generate500ServerError(res);
    if(!getUserResult.data) return generate401Unauthorized(res);

    const user = getUserResult.data;

    const passwordCompareResult = comparePassword(adminPassword, user.password);
    if(!passwordCompareResult.success) {
        if(passwordCompareResult.critical) return generate500ServerError(res);
        return generate404NotFound(res, { password: errorMessages.PASSWORD_IS_INCORRECT });
    };

    const hashPasswordResult = hashPassword(password);
    if(!hashPasswordResult.success) return generate500ServerError(res);
    const hashedPassword = hashPasswordResult.data;

    const createResult = await userService.createUser(firstName, lastName, username, email, hashedPassword, roleID, isVerified, isActive);
    if(!createResult.success){
        if(createResult.errorCode === "UAE01") createResult.errorMessage = { "email": createResult.errorMessage };
        if(createResult.errorCode === "UAE02") createResult.errorMessage = { "username": createResult.errorMessage };
        return generateDatabaseErrorResponse(res, createResult);
    };
    
    if(!isVerified) {
        const userID = createResult.data;
        const generateVerificationTokenResult = generateVerificationToken({ userID: userID });
        if(!generateVerificationTokenResult.success) return generate500ServerError(res);
        const verificationToken = generateVerificationTokenResult.data;

        const createVerificationResult = await verificationService.createVerification(userID, verificationToken, true);
        if(!createVerificationResult.success) return generate500ServerError(res);
    
        await scheduleAccountVerificationEmail(email, verificationToken);
    };

    return generate201Created(res, { id: createResult.data});
};

const updateUser = async (req, res) => {
    const idP = req.params?.id;

    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.USER_NOT_FOUND);
    
    const id = idValidationResult.data;

    if(id === req.userID) return generate400BadRequest(res, 'You can update your account at account page');

    const usernameP = req.body?.username;
    const firstNameP = req.body?.firstName;
    const lastNameP = req.body?.lastName;
    const emailP = req.body?.email;
    const passwordP = req.body?.password;
    const roleIDP = req.body?.roleID;
    const isActiveP = req.body?.isActive;
    const isVerifiedP = req.body?.isVerified;
    const adminPasswordP = req.body?.adminPassword;

    const validationObject = validateUserUpdate(firstNameP, lastNameP, emailP, passwordP, usernameP, roleIDP, isVerifiedP, isActiveP, adminPasswordP);
    const validationResult = await massValidator(validationObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { firstName, lastName, username, email, password, roleID, isActive, isVerified, adminPassword } = validationResult.data;

    const getUserResult = await userService.getUserByID(req.userID, true, true, false);
    if(!getUserResult.success) return generate500ServerError(res);
    if(!getUserResult.data) return generate401Unauthorized(res);

    const user = getUserResult.data;

    const passwordCompareResult = comparePassword(adminPassword, user.password);
    if(!passwordCompareResult.success) {
        if(passwordCompareResult.critical) return generate500ServerError(res);
        return generate404NotFound(res, { password: errorMessages.PASSWORD_IS_INCORRECT });
    };

    let finalPassword = null;
    if(password) {
        const hashPasswordResult = hashPassword(password);
        if(!hashPasswordResult.success) return generate500ServerError(res);
        finalPassword = hashPasswordResult.data;
    }

    const updateResult = await userService.updateAccount(id, firstName, lastName, username, email, finalPassword, roleID, isVerified, isActive);
    if(!updateResult.success){
        if(updateResult.errorCode === "UAE01") updateResult.errorMessage = { "username": updateResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateResult);
    };

    if(!isVerified) {
        const userID = createResult.data;
        const generateVerificationTokenResult = generateVerificationToken({ userID: userID });
        if(!generateVerificationTokenResult.success) return generate500ServerError(res);
        const verificationToken = generateVerificationTokenResult.data;

        const createVerificationResult = await verificationService.createVerification(userID, verificationToken, true);
        if(!createVerificationResult.success) return generate500ServerError(res);
    
        await scheduleAccountVerificationEmail(email, verificationToken);
    };

    return generate202Accepted(res);
};

const deleteUser = async (req, res) => {
    const idP = req.params?.id;

    const idValidationResult = await validateID(idP);
    if(!idValidationResult.success) return generate404NotFound(res, errorMessages.USER_NOT_FOUND);

    const id = idValidationResult.data;

    const adminPasswordP = req.body?.adminPassword;
    const adminPasswordValidationResult = await validatePassword(adminPasswordP);
    if(!adminPasswordValidationResult.success) return generate400BadRequest(res, adminPasswordValidationResult.error);

    const adminPassword = adminPasswordValidationResult.data;

    const getUserResult = await userService.getUserByID(req.userID, true, true, false);
    if(!getUserResult.success) return generate500ServerError(res);
    if(!getUserResult.data) return generate401Unauthorized(res);

    const user = getUserResult.data;

    const passwordCompareResult = comparePassword(adminPassword, user.password);
    if(!passwordCompareResult.success) {
        if(passwordCompareResult.critical) return generate500ServerError(res);
        return generate404NotFound(res, { password: errorMessages.PASSWORD_IS_INCORRECT });
    };

    const deleteResult = await userService.deleteUser(id);
    if(!deleteResult.success) return generateDatabaseErrorResponse(res, deleteResult);
    
    return generate204NoContent(res);
};

const getAccountInfoWriter = async (req, res) => {
    const id = req.userID;

    const getWriterResult = await userService.getAccountDetailsWriter(id);

    if(!getWriterResult.success && getWriterResult.critical) return generate500ServerError(res);
    if(!getWriterResult.success || !getWriterResult?.data) return generate401Unauthorized(res);

    const writer = getWriterResult.data;
    return generate200OK(res, writer);
};

const updateAccountInfo = async (req, res) => {
    const firstNameP = req.body?.firstName;
    const lastNameP = req.body?.lastName;
    const usernameP = req.body?.username;
    const newPasswordP = req.body?.newPassword;
    const passwordP = req.body?.password;

    if(req.body.roleID < 2) usernameP = null;

    const userObject = validateAccountUpdate(firstNameP, lastNameP, usernameP, newPasswordP, passwordP);
    const validationResult = await massValidator(userObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { firstName, lastName, username, newPassword, password } = validationResult.data;

    const getUserResult = await userService.getUserByID(req.userID, true, true, false);
    if(!getUserResult.success) return generate500ServerError(res);
    if(!getUserResult.data) return generate401Unauthorized(res);

    const user = getUserResult.data;
    const compareResult = comparePassword(password, user.password);
    if(!compareResult.success) {
        if(compareResult.critical) return generate500ServerError(res);
        return generate401Unauthorized(res, { password: errorMessages.PASSWORD_IS_INCORRECT });
    };

    let hashedPassword = null;
    if(newPassword){
        const hashPasswordResult = hashPassword(newPassword);
        if(!hashPasswordResult.success) return generate500ServerError(res);
        hashedPassword = hashPasswordResult.data;
    };

    const updateUserResult = await userService.updateAccount(req.userID, firstName, lastName, username, null, hashedPassword || null);
    if(!updateUserResult.success){
        if(updateUserResult.errorCode === "UAE01") updateUserResult.errorMessage = { "username": updateUserResult.errorMessage };
        if(updateUserResult.errorCode === "UAE02") updateUserResult.errorMessage = { "email": updateUserResult.errorMessage };
        return generateDatabaseErrorResponse(res, updateUserResult);
    };

    return generate202Accepted(res);
};

module.exports = {
    getAccountInfoWriter,
    updateAccountInfo,
    getUsers,
    getUserByID,
    getOwnersProtected,
    createUser,
    updateUser,
    deleteUser
};