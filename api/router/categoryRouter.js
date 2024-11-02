const { Router } = require('express');

const categoryController = require('../controller/categoryController');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');
const imageMiddleware = require('../middleware/imageMiddleware');
const { uploadCategoryImage } = require('../middleware/multer');

const publicRouter = Router();
const protectedRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

protectedRouter.get('/list', categoryController.getCategories);
protectedRouter.post('/', imageMiddleware(uploadCategoryImage, 'image', true), categoryController.createCategory);
protectedRouter.put('/:id', imageMiddleware(uploadCategoryImage, 'image', true), categoryController.updateCategory);
protectedRouter.delete('/:id', categoryController.deleteCategory);
protectedRouter.get('/:id', categoryController.getCategoryByID);
protectedRouter.get('/', categoryController.getAllCategoriesProtected);

publicRouter.get('/', categoryController.getAllCategoriesPublic);
publicRouter.get('/slug/:slug', categoryController.getCategoryBySlug);

module.exports = {
    protectedRouter,
    publicRouter
};