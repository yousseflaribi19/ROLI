const express = require('express');
const router = express.Router();
const rollsController = require('../controllers/rollsController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware);

router.get('/', rollsController.getRolls);
router.post('/use', rollsController.useRoll);
router.post('/convert', rollsController.convertDuplicateToPips);

module.exports = router;
