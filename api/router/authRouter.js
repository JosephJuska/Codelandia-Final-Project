const { Router } = require('express');

const authController = require('../controller/authController');

const notAuthenticatedMiddleware = require('../middleware/notAuthenticatedMiddleware');

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.post('/login', notAuthenticatedMiddleware, authController.loginUser);
publicRouter.post('/login/writer', notAuthenticatedMiddleware, authController.loginUserWriter);
publicRouter.post('/login/admin', notAuthenticatedMiddleware, authController.loginUserAdmin);
publicRouter.post('/register', notAuthenticatedMiddleware, authController.registerUser);
publicRouter.post('/token', authController.generateNewToken);

protectedRouter.post('/logout', authController.logoutUser);

module.exports = {
    publicRouter,
    protectedRouter
};