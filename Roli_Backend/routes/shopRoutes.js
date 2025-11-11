const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeMiddleware = require('../middlewares/authorizeMiddleware');

router.use(authMiddleware);

router.get('/items', shopController.listShopItems);
router.post('/create-checkout-session', shopController.createCheckoutSession);

// Webhook Stripe 
router.post('/webhook/stripe', express.raw({ type: 'application/json' }), shopController.stripeWebhookHandler);

module.exports = router;
