const { Router } = require('express');
const publicRouter = require('./public');
const protectedRouter = require('./protected');
const authMiddleware = require('../middleware/authMiddleware');

const router = Router();

router.use('/public', publicRouter);
router.use('/protected', authMiddleware, protectedRouter);

module.exports = router;