const { generate400BadRequest, generate500ServerError, generate201Created, generate404NotFound, generate202Accepted, generate401Unauthorized, generate204NoContent, generateResponse, generateDatabaseErrorResponse, generate200OK } = require("../utils/response-generator");

const userService = require('../service/userService');
const verificationService = require('../service/verificationService');
const sessionService = require('../service/sessionService');

const { validateRegister } = require("../validation/register");
const errorMessages = require("../utils/error-messages");
const { hashPassword, comparePassword } = require("../utils/password");
const { ROLES } = require("../utils/constants");
const { generateVerificationToken, generateRefreshToken, generateAccessToken, verifyRefreshToken } = require("../utils/token");
const validateLogin = require("../validation/login");
const validateToken = require("../validation/token");
const massValidator = require("../validation/mass-validator");
const validateAdminLogin = require("../validation/admin-login");

const { scheduleAccountVerificationEmail } = require('../cronjob/agenda');

const loginUser = async (req, res) => {
    const emailP = req.body?.email;
    const passwordP = req.body?.password;

    const loginObject = validateLogin(emailP, passwordP);
    const validationResult = await massValidator(loginObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { email, password } = validationResult.data;
    const getUserByEmailResult = await userService.getUserByEmail(email, true, true, null, false);
    if(!getUserByEmailResult.success) return generate500ServerError(res);
    if(!getUserByEmailResult.data) return generate404NotFound(res, errorMessages.EMAIL_OR_PASSWORD_IS_INCORRECT);

    const user = getUserByEmailResult.data;

    const hashedPassword = user.password;
    const passwordCompareResult = comparePassword(password, hashedPassword);
    if(!passwordCompareResult.success) {
        if(passwordCompareResult.critical) return generate500ServerError(res);
        return generate404NotFound(res, errorMessages.EMAIL_OR_PASSWORD_IS_INCORRECT);
    };

    const generateRefreshTokenResult = generateRefreshToken({userID: user.id, roleID: user.roleID});
    if(!generateRefreshTokenResult.success) return generate500ServerError(res);
    const refreshToken = generateRefreshTokenResult.data;

    const generateAccessTokenResult = generateAccessToken({userID: user.id, roleID: user.roleID});
    if(!generateAccessTokenResult.success) return generate500ServerError(res);
    const accessToken = generateAccessTokenResult.data;

    const createSessionResult = await sessionService.createSession(user.id, refreshToken);
    if(!createSessionResult.success) return generate500ServerError(res);

    return generate202Accepted(res, {refreshToken: refreshToken, accessToken: accessToken});
};

const loginUserWriter = async (req, res) => {
    const usernameOrEmailP = req.body?.usernameOrEmail;
    const passwordP = req.body?.password;

    const loginObject = validateAdminLogin(usernameOrEmailP, passwordP);
    const validationResult = await massValidator(loginObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { usernameOrEmail, password } = validationResult.data;
    const getUserByEmailResult = await userService.getUserByUsernameOrEmail(usernameOrEmail, ROLES.WRITER_ROLE);
    if(!getUserByEmailResult.success) return generate500ServerError(res);
    if(!getUserByEmailResult.data) return generate404NotFound(res, errorMessages.USERNAME_EMAIL_OR_PASSWORD_IS_INCORRECT);

    const user = getUserByEmailResult.data;

    const hashedPassword = user.password;
    const passwordCompareResult = comparePassword(password, hashedPassword);
    if(!passwordCompareResult.success) {
        if(passwordCompareResult.critical) return generate500ServerError(res);
        return generate404NotFound(res, errorMessages.USERNAME_EMAIL_OR_PASSWORD_IS_INCORRECT);
    };

    const generateRefreshTokenResult = generateRefreshToken({userID: user.id, roleID: user.roleID});
    if(!generateRefreshTokenResult.success) return generate500ServerError(res);
    const refreshToken = generateRefreshTokenResult.data;

    const generateAccessTokenResult = generateAccessToken({userID: user.id, roleID: user.roleID});
    if(!generateAccessTokenResult.success) return generate500ServerError(res);
    const accessToken = generateAccessTokenResult.data;

    const createSessionResult = await sessionService.createSession(user.id, refreshToken);
    if(!createSessionResult.success) return generate500ServerError(res);

    return generate202Accepted(res, {refreshToken: refreshToken, accessToken: accessToken});
};

const loginUserAdmin = async (req, res) => {
    const usernameOrEmailP = req.body?.usernameOrEmail;
    const passwordP = req.body?.password;

    const loginObject = validateAdminLogin(usernameOrEmailP, passwordP);
    const validationResult = await massValidator(loginObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { usernameOrEmail, password } = validationResult.data;
    const getUserByEmailResult = await userService.getUserByUsernameOrEmail(usernameOrEmail, ROLES.ADMIN_ROLE);
    if(!getUserByEmailResult.success) return generate500ServerError(res);
    if(!getUserByEmailResult.data) return generate404NotFound(res, errorMessages.USERNAME_EMAIL_OR_PASSWORD_IS_INCORRECT);

    const user = getUserByEmailResult.data;

    const hashedPassword = user.password;
    const passwordCompareResult = comparePassword(password, hashedPassword);
    if(!passwordCompareResult.success) {
        if(passwordCompareResult.critical) return generate500ServerError(res);
        return generate404NotFound(res, errorMessages.USERNAME_EMAIL_OR_PASSWORD_IS_INCORRECT);
    };

    const generateRefreshTokenResult = generateRefreshToken({userID: user.id, roleID: user.roleID});
    if(!generateRefreshTokenResult.success) return generate500ServerError(res);
    const refreshToken = generateRefreshTokenResult.data;

    const generateAccessTokenResult = generateAccessToken({userID: user.id, roleID: user.roleID});
    if(!generateAccessTokenResult.success) return generate500ServerError(res);
    const accessToken = generateAccessTokenResult.data;

    const createSessionResult = await sessionService.createSession(user.id, refreshToken);
    if(!createSessionResult.success) return generate500ServerError(res);

    return generate202Accepted(res, {refreshToken: refreshToken, accessToken: accessToken});
};

const registerUser = async (req, res) => {
    const firstNameP = req.body?.firstName;
    const lastNameP = req.body?.lastName;
    const emailP = req.body?.email;
    const passwordP = req.body?.password;

    const registerObject = validateRegister(firstNameP, lastNameP, emailP, passwordP);
    const validationResult = await massValidator(registerObject);
    if(!validationResult.success) return generate400BadRequest(res, validationResult.error);

    const { firstName, lastName, email, password } = validationResult.data;

    const hashPasswordResult = hashPassword(password);
    if(!hashPasswordResult.success) return generate500ServerError(res);
    const hashedPassword = hashPasswordResult.data;
    
    const createUserResult = await userService.createUser(firstName, lastName, null, email, hashedPassword, ROLES.CUSTOMER_ROLE);
    if(!createUserResult.success) {
        if(createUserResult.errorCode === 'UAE01') createUserResult.errorMessage = { "email": createUserResult.errorMessage };
        if(createUserResult.errCode === 'UAE02') createUserResult.errorMessage = { "username": createUserResult.errorMessage };
        return generateDatabaseErrorResponse(res, createUserResult);
    };
    const userID = createUserResult.data;

    const getCountResult = await verificationService.getVerificationCount(true);
    if(!getCountResult.success) return generate500ServerError(res);
    if(getCountResult.data >= 3) return generateDatabaseErrorResponse(res, getCountResult);
    
    const generateVerificationTokenResult = generateVerificationToken({ userID: userID });
    if(!generateVerificationTokenResult.success) return generate500ServerError(res);
    const verificationToken = generateVerificationTokenResult.data;
    
    const createVerificationResult = await verificationService.createVerification(userID, verificationToken, true);
    if(!createVerificationResult.success) return generate500ServerError(res);
    
    await scheduleAccountVerificationEmail(email, verificationToken);
    return generate201Created(res);
};

const generateNewToken = async (req, res) => {
    const refreshToken = req.body?.token;

    const tokenValidationResult = await validateToken(refreshToken);
    if(!tokenValidationResult.success) return generate400BadRequest(res, tokenValidationResult.error);
    const token = tokenValidationResult.data;

    const verifyTokenResult = verifyRefreshToken(token);
    if(!verifyTokenResult.success){
        if(verifyTokenResult.critical) return generate500ServerError(res);
        return generate401Unauthorized(res, verifyTokenResult.error);
    }

    const payload = verifyTokenResult.data;
    const getSessionResult = await sessionService.getSession(payload.userID, token);
    if(!getSessionResult.success) return generate500ServerError(res);
    if(!getSessionResult.data) return generate401Unauthorized(res, errorMessages.SESSION_NOT_FOUND);

    const generateTokenResult = generateAccessToken({ userID: payload.userID, roleID: payload.roleID });
    if(!generateTokenResult.success) return generate500ServerError(res);

    const accessToken = generateTokenResult.data;
    return generate201Created(res, {accessToken: accessToken});
};

const logoutUser = async (req, res) => {
    const refreshToken = req.body?.token;

    const tokenValidationResult = await validateToken(refreshToken);
    if(!tokenValidationResult.success) return generate400BadRequest(res, tokenValidationResult.error);
    const token = tokenValidationResult.data;

    const verifyTokenResult = verifyRefreshToken(token);
    if(!verifyTokenResult.success){
        if(verifyTokenResult.critical) return generate500ServerError(res);
        return generate401Unauthorized(res, verifyTokenResult.error);
    }
    const payload = verifyTokenResult.data;

    const finishSessionResult = await sessionService.finishSession(payload.userID, token);
    if(!finishSessionResult.success) return generateDatabaseErrorResponse(res, finishSessionResult);

    return generate204NoContent(res);
};

module.exports = {
    loginUser,
    loginUserWriter,
    loginUserAdmin,
    registerUser,
    generateNewToken,
    logoutUser
}