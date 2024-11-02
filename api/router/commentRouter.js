const { Router } = require('express');

const commentController = require('../controller/commentController');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

const protectedRouter = Router();
const publicRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

publicRouter.get('/:id', commentController.getCommentsPublic);

protectedRouter.post('/', commentController.createComment);
protectedRouter.get('/', commentController.getCommentsProtected);
protectedRouter.delete('/:id', commentController.deleteComment);

module.exports = {
    publicRouter,
    protectedRouter
};