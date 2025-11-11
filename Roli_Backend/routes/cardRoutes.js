const express = require('express');
const router = express.Router();
const cardController = require('../controllers/cardController');
const authMiddleware = require('../middlewares/authMiddleware');
const authorizeMiddleware = require('../middlewares/authorizeMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.use(authMiddleware);
router.use(authorizeMiddleware('admin'));

router.get('/', cardController.listCards);
router.get('/new', cardController.showCreateForm);
router.post('/new', upload.single('image'), cardController.createCard);    

router.get('/edit/:id', cardController.showEditForm);
router.post('/edit/:id', upload.single('image'), cardController.updateCard);

router.post('/delete/:id', cardController.deleteCard);

module.exports = router;
