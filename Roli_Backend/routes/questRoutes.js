const express = require('express');
const router = express.Router();
const questController = require('../controllers/questController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', questController.listQuests);
router.get('/progress', questController.getUserProgress);
router.post('/claim/:questId', questController.claimReward);

module.exports = router;
