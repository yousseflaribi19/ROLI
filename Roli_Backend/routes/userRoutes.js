const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeMiddleware = require('../middlewares/authorizeMiddleware');

router.use(authMiddleware);
router.use(authorizeMiddleware('admin'));

router.get('/', userController.listUsers);
router.get('/edit/:id', userController.showEditForm);
router.post('/edit/:id', userController.updateUser);
router.post('/ban/:id', userController.banUser);
router.post('/unban/:id', userController.unbanUser);

module.exports = router;
