const { Router } = require('express');

const brandController = require('../controller/brandController');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');
const imageMiddleware = require('../middleware/imageMiddleware');
const { uploadBrandImage } = require('../middleware/multer');

const publicRouter = Router();
const protectedRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

publicRouter.get('/', brandController.getBrandsPublic);

protectedRouter.post('/', imageMiddleware(uploadBrandImage, 'image'), brandController.createBrand);
protectedRouter.put('/:id', imageMiddleware(uploadBrandImage, 'image'), brandController.updateBrand);
protectedRouter.delete('/:id', brandController.deleteBrand);
protectedRouter.get('/', brandController.getBrandsProtected);
protectedRouter.get('/:id', brandController.getBrandByID);

module.exports = {
    protectedRouter,
    publicRouter
};