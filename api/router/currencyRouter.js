const { Router } = require('express');

const currencyController = require('../controller/currencyController');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

const protectedRouter = Router();
const publicRouter = Router();

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

publicRouter.get('/', currencyController.getCurrency);

protectedRouter.put('/', currencyController.updateCurrency);
protectedRouter.get('/current', currencyController.getCurrentCurrency);

module.exports = {
    publicRouter,
    protectedRouter
};