const { Router } = require('express');

const productController = require('../controller/productController');
const imageMiddleware = require('../middleware/imageMiddleware');
const { uploadProductImage } = require('../middleware/multer');

const router = Router();

router.post('/add-image', imageMiddleware(uploadProductImage, 'image'), productController.addImage);

router.post('/product-item', productController.createProductItem);
router.put('/product-item/:id', productController.updateProductItem);
router.delete('/product-item/:id', productController.deleteProductItem);

router.post('/product-variation', productController.createProductVariation);
router.put('/product-variation/:id', productController.updateProductVariation);
router.delete('/product-variation/:id', productController.deleteProductVariation);

router.post('/product-variation-field', productController.createProductVariationField);
router.put('/product-variation-field/:id', productController.updateProductVariationField);
router.delete('/product-variation-field/:id', productController.deleteProductVariationField);

router.post('/', productController.createProduct);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

router.get('/list', productController.getProductsList);
router.get('/', productController.getProductsProtected);
router.get('/:id', productController.getProductByID);

module.exports = router;