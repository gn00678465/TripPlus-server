const express = require('express');
const router = express.Router();

const { isAdmin } = require('../services/auth');

const ProjectController = require('../controllers/adminProject');

router.post('/', isAdmin, ProjectController.handleCreateProject);
router.post('/:id/plan', isAdmin, ProjectController.handleCreateProjectPlan);

router.get('/:projId/team/:teamId', isAdmin, ProjectController.handleReadTeam);
router.get('/:id/info', isAdmin, ProjectController.handleReadProject);
router.get('/:id/content', isAdmin, ProjectController.handleReadProjectContent);
router.get('/:id/plan', isAdmin, ProjectController.handleReadProjectPlan);

router.patch(
  '/:id/info/settings',
  isAdmin,
  ProjectController.handleUpdateProjectSetting
);
router.patch(
  '/:projId/team/:teamId',
  isAdmin,
  ProjectController.handleUpdateTeam
);
router.patch(
  '/:id/info/image',
  isAdmin,
  ProjectController.handleUpdateProjectImage
);
router.patch(
  '/:id/info/payment',
  isAdmin,
  ProjectController.handleUpdateProjectPayment
);
router.patch(
  '/:id/info/content',
  isAdmin,
  ProjectController.handleUpdateProjectContent
);
router.patch(
  '/:projId/plan/:planId',
  isAdmin,
  ProjectController.handleUpdateProjectPlan
);

router.delete(
  '/:projId/plan/:planId',
  isAdmin,
  ProjectController.handleDeleteProjectPlan
);

module.exports = router;
