const express = require('express');
const router = express.Router();
const ProjectController = require('../controllers/project');
const { isAuth } = require('../services/auth');

router.get('/', ProjectController.handleGetProjectList);
router.get('/:id', ProjectController.handleGetProject);
router.get('/:id/news', ProjectController.handleGetProjectNews);
router.get('/:id/faqs', ProjectController.handleGetProjectFaqs);
router.get(
  '/:projId/plan/:planId',
  isAuth,
  ProjectController.handleGetProjectPlan
);

module.exports = router;
