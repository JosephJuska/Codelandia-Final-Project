const { Router } = require('express');
const userController = require('../controller/userController');

const roleMiddleware = require('../middleware/roleMiddleware');

const { ROLES } = require('../utils/constants');

const router = Router();

router.get('/', roleMiddleware(ROLES.WRITER_ROLE), userController.getUsers);
router.post('/', roleMiddleware(ROLES.WRITER_ROLE), userController.createUser);
router.put('/update-account', userController.updateAccountInfo);
router.get('/account-writer', roleMiddleware(ROLES.WRITER_ROLE), userController.getAccountInfoWriter);
router.get('/owners', roleMiddleware(ROLES.ADMIN_ROLE), userController.getOwnersProtected);
router.put('/:id', roleMiddleware(ROLES.WRITER_ROLE), userController.updateUser);
router.delete('/:id', roleMiddleware(ROLES.WRITER_ROLE), userController.deleteUser);
router.get('/:id', roleMiddleware(ROLES.WRITER_ROLE), userController.getUserByID);

module.exports = router;