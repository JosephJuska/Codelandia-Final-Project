const productTypeController = require('../controller/productTypeController');

const { Router } = require('express');
const roleMiddleware = require('../middleware/roleMiddleware');
const { ROLES } = require('../utils/constants');

const publicRouter = Router();
const protectedRouter = Router();

publicRouter.get('/category/:id', productTypeController.getProductTypeByCategoryID);

protectedRouter.use(roleMiddleware(ROLES.ADMIN_ROLE));

protectedRouter.post('/field/:id', productTypeController.addProductTypeField);
protectedRouter.put('/field/:id', productTypeController.updateProductTypeField);
protectedRouter.delete('/field/:id', productTypeController.deleteProductTypeField);

protectedRouter.get('/', productTypeController.getProductTypes);
protectedRouter.get('/:id', productTypeController.getProductTypeByID);
protectedRouter.post('/', productTypeController.createProductType);
protectedRouter.put('/:id', productTypeController.updateProductType);
protectedRouter.delete('/:id', productTypeController.deleteProductType);


module.exports = {
    publicRouter,
    protectedRouter
};