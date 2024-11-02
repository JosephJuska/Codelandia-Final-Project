const { Router } = require('express');
const announcementController = require('../controller/announcementController');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

const protectedRouter = Router();
const publicRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

publicRouter.get('/', announcementController.getAnnouncementsPublic);

protectedRouter.get('/', announcementController.getAnnouncementsProtected);
protectedRouter.get('/:id', announcementController.getAnnouncementByID);
protectedRouter.post('/', announcementController.createAnnouncement);
protectedRouter.put('/:id', announcementController.updateAnnouncement);
protectedRouter.delete('/:id', announcementController.deleteAnnouncement);

module.exports = {
    publicRouter,
    protectedRouter
};