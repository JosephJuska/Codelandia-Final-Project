const { Router } = require('express');

const verifyRouter = require('./verifyRouter');
const blogRouter = require('./blogRouter');
const bannerRouter = require('./bannerRouter');
const announcementRouter = require('./announcementRouter');
const authRouter = require('./authRouter');
const commentRouter = require('./commentRouter');
const teamMemberRouter = require('./teamMemberRouter');
const brandRouter = require('./brandRouter');
const productTypeRouter = require('./productTypeRouter');
const categoryRouter = require('./categoryRouter');
const userRouter = require('./userRouter');
const discountRouter = require('./discountRouter');
const productRouter = require('./productRouter');
const reviewRouter = require('./reviewRouter');
const currencyRouter = require('./currencyRouter');

const router = Router();

router.use('/verify', verifyRouter.protectedRouter);
router.use('/blog', blogRouter.protectedRouter);
router.use('/banner', bannerRouter.protectedRouter);
router.use('/announcement', announcementRouter.protectedRouter);
router.use('/auth', authRouter.protectedRouter);
router.use('/comment', commentRouter.protectedRouter);
router.use('/team-member', teamMemberRouter.protectedRouter);
router.use('/brand', brandRouter.protectedRouter);
router.use('/product-type', productTypeRouter.protectedRouter);
router.use('/category', categoryRouter.protectedRouter);
router.use('/user', userRouter);
router.use('/discount', discountRouter);
router.use('/product', productRouter);
router.use('/review', reviewRouter);
router.use('/currency', currencyRouter.protectedRouter);

module.exports = router;