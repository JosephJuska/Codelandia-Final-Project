const { Router } = require('express');

const teamMemberController = require('../controller/teamMemberController');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');
const imageMiddleware = require('../middleware/imageMiddleware');
const { uploadTeamMemberImage } = require('../middleware/multer');

const publicRouter = Router();
const protectedRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

publicRouter.get('/', teamMemberController.getTeamMembersPublic);

protectedRouter.post('/', imageMiddleware(uploadTeamMemberImage, 'image'), teamMemberController.createTeamMember);
protectedRouter.put('/:id', imageMiddleware(uploadTeamMemberImage, 'image'), teamMemberController.updateTeamMember);
protectedRouter.delete('/:id', teamMemberController.deleteTeamMember);
protectedRouter.get('/', teamMemberController.getTeamMembersProtected);
protectedRouter.get('/:id', teamMemberController.getTeamMemberByID);

module.exports = {
    publicRouter,
    protectedRouter,
};