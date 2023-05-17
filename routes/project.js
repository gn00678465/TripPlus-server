const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project');

router.get('/', ProjectController.handleGetProjectList);

module.exports = router;
