const { Router } = require('express');

const verifyController = require('../controller/verifyController');
const authMiddleware = require('../middleware/authMiddleware');

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/email/:token', verifyController.verifyEmail);
publicRouter.get('/account/:token', verifyController.verifyAccount);
publicRouter.get('/delete/:token', verifyController.deleteAccount);
publicRouter.get('/reset-password-confirm/:token', verifyController.verifyResetPassword);
publicRouter.post('/reset-password/:token', verifyController.resetPassword);
publicRouter.post('/generate/reset-password', verifyController.generateResetPassword);

protectedRouter.get('/generate/delete', authMiddleware, verifyController.generateDelete);
protectedRouter.post('/generate/email', authMiddleware, verifyController.generateEmailVerification);
protectedRouter.get('/generate/delete', authMiddleware, verifyController.generateDelete);

module.exports = {
    publicRouter,
    protectedRouter
};