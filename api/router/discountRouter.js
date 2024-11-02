const { Router } = require('express');
const discountController = require('../controller/discountController');

const router = Router();

router.get('/:id', discountController.getDiscountByID);
router.get('/', discountController.getDiscounts);
router.post('/', discountController.createDiscount);
router.put('/:id', discountController.updateDiscount);
router.delete('/:id', discountController.deleteDiscount);

module.exports = router;