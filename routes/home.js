const express = require('express');
const router = express.Router();
const HomeController = require('../controllers/home');

router.get('/', HomeController.getProjects);
router.get('/data', HomeController.getData);
router.get('/banner', HomeController.getBanner);

module.exports = router;
