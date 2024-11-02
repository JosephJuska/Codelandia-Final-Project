const { Router } = require('express');

const { uploadBannerImage } = require('../middleware/multer');

const bannerController = require('../controller/bannerController');
const imageMiddleware = require('../middleware/imageMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { ROLES } = require('../utils/constants');

const publicRouter = Router();
const protectedRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

publicRouter.get('/', bannerController.getBannersPublic);

protectedRouter.get('/', bannerController.getBannersProtected);
protectedRouter.get('/:id', bannerController.getBannerByID);
protectedRouter.post('/', imageMiddleware(uploadBannerImage, 'background'), bannerController.createBanner);
protectedRouter.put('/:id', imageMiddleware(uploadBannerImage, 'background'), bannerController.updateBanner);
protectedRouter.delete('/:id', bannerController.deleteBanner);

module.exports = {
    publicRouter,
    protectedRouter,
};