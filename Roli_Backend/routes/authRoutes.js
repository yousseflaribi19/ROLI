const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/login', (req, res) => res.render('admin/login'));

module.exports = router;
