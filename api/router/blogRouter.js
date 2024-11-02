const { Router } = require('express');

const { uploadBlogImage, uploadBlogBanner } = require('../middleware/multer');

const blogController = require('../controller/blogController');
const imageMiddleware = require('../middleware/imageMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { ROLES } = require('../utils/constants');

const publicRouter = Router();
const protectedRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.WRITER_ROLE));

publicRouter.get('/slug/:slug', blogController.getBlogBySlug);
publicRouter.get('/', blogController.getBlogsPublic);

protectedRouter.get('/list', blogController.getBlogsList);
protectedRouter.get('/', roleMiddleware(ROLES.ADMIN_ROLE), blogController.getBlogsProtected);
protectedRouter.get('/writer', blogController.getBlogsProtectedWriter);
protectedRouter.get('/:id', blogController.getBlogByID);
protectedRouter.post('/add-image', imageMiddleware(uploadBlogImage, 'image'), blogController.addImage);
protectedRouter.post('/', imageMiddleware(uploadBlogBanner, 'banner'), blogController.createBlog);
protectedRouter.put('/:id', imageMiddleware(uploadBlogBanner, 'banner'), blogController.updateBlog);
protectedRouter.delete('/:id', blogController.deleteBlog);

module.exports = {
    publicRouter,
    protectedRouter
};