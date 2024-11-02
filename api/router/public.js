const { Router } = require('express');

const verifyRouter = require('./verifyRouter');
const blogRouter = require('./blogRouter');
const bannerRouter = require('./bannerRouter')
const announcementRouter = require('./announcementRouter');
const authRouter = require('./authRouter');
const commentRouter = require('./commentRouter');
const teamMemberRouter = require('./teamMemberRouter');
const brandRouter = require('./brandRouter');
const productTypeRouter = require('./productTypeRouter');
const categoryRouter = require('./categoryRouter');
const currencyRouter = require('./currencyRouter');

const router = Router();

router.use('/verify', verifyRouter.publicRouter);
router.use('/blog', blogRouter.publicRouter);
router.use('/banner', bannerRouter.publicRouter);
router.use('/announcement', announcementRouter.publicRouter);
router.use('/auth', authRouter.publicRouter);
router.use('/comment', commentRouter.publicRouter);
router.use('/team-member', teamMemberRouter.publicRouter);
router.use('/brand', brandRouter.publicRouter);
router.use('/product-type', productTypeRouter.publicRouter);
router.use('/category', categoryRouter.publicRouter);
router.use('/currency', currencyRouter.publicRouter);

module.exports = router;