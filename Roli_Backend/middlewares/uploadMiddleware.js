const multer = require('multer');
const { storage } = require('../config/cloudinary');

const parser = multer({ storage });

module.exports = parser;
