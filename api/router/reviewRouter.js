const { Router } = require('express');
const reviewController = require('../controller/reviewController');

const router = Router();

router.get('/product/:id', reviewController.getReviewsByProductID);
router.get('/:id', reviewController.getReviewByID);
router.get('/', reviewController.getReviews);
router.post('/', reviewController.createReview);
router.delete('/:id', reviewController.deleteReview);

module.exports = router;