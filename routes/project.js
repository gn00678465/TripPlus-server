const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project');

router.get('/', ProjectController.handleGetProjectList);
router.get('/:id', ProjectController.handleGetProject);

module.exports = router;
