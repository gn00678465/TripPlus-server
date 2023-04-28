const express = require('express');
const router = express.Router();
const { isAuth } = require('../services/auth');
const uploadMulter = require('../services/uploadMulter');
const UploadController = require('../controllers/upload');

router.post('/', isAuth, uploadMulter, UploadController.handleUpload);

module.exports = router;
