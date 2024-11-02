const { Router } = require('express');

const newsletterController = require('../controller/newsletterController');

const router = Router();

router.post('/', newsletterController.subscribeToNewsLetter);
router.get('/:token', newsletterController.unsubscribeFromNewsLetter);

module.exports = router;