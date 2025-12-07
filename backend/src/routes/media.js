const express = require('express');
const multer = require('multer');
const { upload, list, listCloudinary } = require('../controllers/mediaController');

const router = express.Router();

// memory storage so we can stream to Cloudinary
const storage = multer.memoryStorage();
const uploadMiddleware = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

router.post('/upload', uploadMiddleware.array('file', 10), upload);
router.get('/', list);
router.get('/cloudinary', listCloudinary);

module.exports = router;
