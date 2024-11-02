const { generate400BadRequest, generate500ServerError, generate404NotFound, generate202Accepted, generateDatabaseErrorResponse, generate200OK, generate401Unauthorized } = require("../utils/response-generator");
const { verifyVerificationToken, generateVerificationToken } = require("../utils/token");
const validateToken = require("../validation/token");

const userService = require('../service/userService');
const verificationService = require('../service/verificationService');

const errorMessages = require('../utils/error-messages');
const validatePassword = require("../validation/user-password");
const { hashPassword, comparePassword } = require("../utils/password");
const validateEmail = require("../validation/email");
const { scheduleEmailVerificationEmail, schedulePasswordResetEmail, scheduleAccountDeletionEmail } = require("../cronjob/agenda");
const { validateEmailUpdate } = require("../validation/user");
const massValidator = require("../validation/mass-validator");

const verifyEmail = async (req, res) => {
    const verificationToken = req.params?.token;
    const tokenValidationResult = await validateToken(verificationToken);
    if(!tokenValidationResult.success) return generate404NotFound(res, errorMessages.VERIFICATION_NOT_FOUND);
    const token = tokenValidationResult.data;

    const verifyTokenResult = verifyVerificationToken(token);
    if(!verifyTokenResult.success) {
        if(verifyTokenResult.critical) return generate500ServerError(res);
        return generate400BadRequest(res, verifyTokenResult.error);
    };
    const payload = verifyTokenResult.data;
    const userID = payload.userID;
    
    const verifyEmailResult = await userService.verifyAndUpdateEmail(userID, token);
    if(!verifyEmailResult.success){
        if(verifyEmailResult.errorCode === "UAE01") verifyEmailResult.errorMessage = { "email": verifyEmailResult.errorMessage };
        return generateDatabaseErrorResponse(res, verifyEmailResult);
    };

    return generate202Accepted(res);
};

const verifyAccount = async (req, res) => {
    const verificationToken = req.params?.token;
    const tokenValidationResult = await validateToken(verificationToken);
    if(!tokenValidationResult.success) return generate404NotFound(res, errorMessages.VERIFICATION_NOT_FOUND);
    const token = tokenValidationResult.data;

    const verifyTokenResult = verifyVerificationToken(token);
    if(!verifyTokenResult.success) {
        if(verifyTokenResult.critical) return generate500ServerError(res);
        return generate400BadRequest(res, verifyTokenResult.error);
    };
    const payload = verifyTokenResult.data;

    const userID = payload.userID;
    
    const verifyAccountResult = await userService.verifyAndUpdateAccount(userID, token);
    if(!verifyAccountResult.success) return generateDatabaseErrorResponse(res, verifyAccountResult);
    
    return generate202Accepted(res);
};

const verifyResetPassword = async (req, res) => {
    const verificationToken = req.params?.token;
    const tokenValidationResult = await validateToken(verificationToken);
    if(!tokenValidationResult.success) return generate404NotFound(res, errorMessages.VERIFICATION_NOT_FOUND);
    const token = tokenValidationResult.data;

    const verifyTokenResult = verifyVerificationToken(token);
    if(!verifyTokenResult.success) {
        if(verifyTokenResult.critical) return generate500ServerError(res);
        return generate400BadRequest(res, verifyTokenResult.error);
    };

    const payload = verifyTokenResult.data;

    const userID = payload.userID;

    const validationResult = await verificationService.getVerification(userID, token, false, true, false, false, false);
    if(!validationResult.success) return generate404NotFound(res, errorMessages.VERIFICATION_NOT_FOUND);
    if(!validationResult.data) return generate404NotFound(res, errorMessages.VERIFICATION_NOT_FOUND);

    return generate200OK(res);
};

const resetPassword = async (req, res) => {
    const verificationToken = req.params?.token;
    const tokenValidationResult = await validateToken(verificationToken);
    if(!tokenValidationResult.success) return generate404NotFound(res, errorMessages.VERIFICATION_NOT_FOUND);
    const token = tokenValidationResult.data;

    const verifyTokenResult = verifyVerificationToken(token);
    if(!verifyTokenResult.success) {
        if(verifyTokenResult.critical) return generate500ServerError(res);
        return generate400BadRequest(res, verifyTokenResult.error);
    };

    const getCountResult = await verificationService.getVerificationCount(null, true);
    if(!getCountResult.success) return generate500ServerError(res);
    if(getCountResult.data >= 3) return generateDatabaseErrorResponse(res, getCountResult);

    const payload = verifyTokenResult.data;

    const userID = payload.userID;

    const passwordP = req.body?.password;
    
    const passwordValidateResult = await validatePassword(passwordP);
    if(!passwordValidateResult.success) return generate400BadRequest(res, passwordValidateResult.error);
    const password = passwordValidateResult.data;

    const hashPasswordResult = hashPassword(password);
    if(!hashPasswordResult.success) return generate500ServerError(res);
    const hashedPassword = hashPasswordResult.data;

    const verifyPasswordResult = await userService.verifyAndUpdatePassword(userID, token, hashedPassword);
    if(!verifyPasswordResult.success) return generateDatabaseErrorResponse(res, verifyPasswordResult);
    
    return generate202Accepted(res);
};

const deleteAccount = async (req, res) => {
    const verificationToken = req.params?.token;
    const tokenValidationResult = await validateToken(verificationToken);
    if(!tokenValidationResult.success) return generate404NotFound(res, errorMessages.VERIFICATION_NOT_FOUND);
    const token = tokenValidationResult.data;

    const getCountResult = await verificationService.getVerificationCount(null, null, null, true);
    if(!getCountResult.success) return generate500ServerError(res);
    if(getCountResult.data >= 3) return generateDatabaseErrorResponse(res, getCountResult);

    const verifyTokenResult = verifyVerificationToken(token);
    if(!verifyTokenResult.success) {
        if(verifyTokenResult.critical) return generate500ServerError(res);
        return generate400BadRequest(res, verifyTokenResult.error);
    };

    const payload = verifyTokenResult.data;

    const userID = payload.userID;

    const deleteAccountResult = await userService.deleteUser(userID);
    if(!deleteAccountResult.success) return generateDatabaseErrorResponse(res, deleteAccountResult);

    return generate202Accepted(res);
};

const generateEmailVerification = async (req, res) => {
    const emailP = req.body?.email;
    const passwordP = req.body?.password;

    const userObject = validateEmailUpdate(emailP, passwordP);
    const emailValidateResult = await massValidator(userObject);
    if(!emailValidateResult.success) return generate400BadRequest(res, emailValidateResult.error);
    const { email, password } = emailValidateResult.data;

    const getUserByEmailResult = await userService.getUserByEmail(email, true);
    if(!getUserByEmailResult.success) return generate500ServerError(res);
    if(getUserByEmailResult.data) return generate400BadRequest(res, { "email": `User with email ${email} already exists` });

    const getUserByIDResult = await userService.getUserByID(req.userID, true, true, false);
    if(!getUserByIDResult.success) return generate500ServerError(res);
    if(!getUserByIDResult.data) return generate404NotFound(res, errorMessages.USER_NOT_FOUND);
    const user = getUserByIDResult.data;

    const getCountResult = await verificationService.getVerificationCount(null, null, true);
    if(!getCountResult.success) return generate500ServerError(res);
    if(getCountResult.data >= 3) return generate400BadRequest(res, errorMessages.TOO_MANY_VERIFICATION_ATTEMPTS);

    const compareResult = comparePassword(password, user.password);
    if(!compareResult.success) {
        if(compareResult.critical) return generate500ServerError(res);
        return generate400BadRequest(res, { password: errorMessages.PASSWORD_IS_INCORRECT });
    };

    const generateTokenResult = generateVerificationToken({ userID: user.id });
    if(!generateTokenResult.success) return generate500ServerError(res);
    const token = generateTokenResult.data;

    const generateVerificationResult = await verificationService.createVerification(user.id, token, false, false, true, false, email);
    if(!generateVerificationResult.success) return generate500ServerError(res);

    await scheduleEmailVerificationEmail(email, token);

    return generate202Accepted(res);
};

const generateResetPassword = async (req, res) => {
    const emailP = req.body?.email;

    const emailValidateResult = await validateEmail(emailP);
    if(!emailValidateResult.success) return generate400BadRequest(res, emailValidateResult.error);
    const email = emailValidateResult.data;

    const getUserByEmailResult = await userService.getUserByEmail(email, true, true);
    if(!getUserByEmailResult.success) return generate500ServerError(res);
    if(!getUserByEmailResult.data) return generate404NotFound(res, errorMessages.USER_NOT_FOUND);
    const user = getUserByEmailResult.data;

    const getCountResult = await verificationService.getVerificationCount(null, true);
    if(!getCountResult.success) return generate500ServerError(res);
    if(getCountResult.data >= 3) return generate400BadRequest(res, errorMessages.TOO_MANY_VERIFICATION_ATTEMPTS);
    
    const generateTokenResult = generateVerificationToken({ userID: user.id });
    if(!generateTokenResult.success) return generate500ServerError(res);
    const token = generateTokenResult.data;
    
    const generateVerificationResult = await verificationService.createVerification(user.id, token, false, true);
    if(!generateVerificationResult.success) return generate500ServerError(res);
    
    await schedulePasswordResetEmail(email, token);

    return generate202Accepted(res);
};

const generateDelete = async (req, res) => {
    const userID = req?.userID;

    const getUserByIDResult = await userService.getUserByID(userID, true, true);
    if(!getUserByIDResult.success) return generate500ServerError(res);
    if(!getUserByIDResult.data) return generate404NotFound(res, errorMessages.USER_NOT_FOUND);

    const getCountResult = await verificationService.getVerificationCount(null, null, null, true);
    if(!getCountResult.success) return generate500ServerError(res);
    if(getCountResult.data >= 3) return generate400BadRequest(res, errorMessages.TOO_MANY_VERIFICATION_ATTEMPTS);

    const user = getUserByIDResult.data;
    const generateTokenResult = generateVerificationToken({ userID: userID });
    if(!generateTokenResult.success) return generate500ServerError(res);
    const token = generateTokenResult.data;

    const generateVerificationResult = await verificationService.createVerification(userID, token, false, false, false, true);
    if(!generateVerificationResult.success) return generate500ServerError(res);

    await scheduleAccountDeletionEmail(user.email, token);

    return generate202Accepted(res);
};

module.exports = {
    verifyEmail,
    verifyAccount,
    verifyResetPassword,
    resetPassword,
    deleteAccount,

    generateResetPassword,
    generateEmailVerification,
    generateDelete
};