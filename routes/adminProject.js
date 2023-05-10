const express = require('express');
const router = express.Router();

const { isAuth, generateSendJWT, isAdmin } = require('../services/auth');

const ProjectController = require('../controllers/adminProject');

router.post('/', isAdmin, ProjectController.handleCreateProject);
router.get('/:id/info', isAdmin, ProjectController.handleReadProject);
router.patch(
  '/:id/info/settings',
  isAdmin,
  ProjectController.handleUpdateProjectSetting
);

//teams
router.get('/:projId/team/:teamId', isAdmin, ProjectController.handleReadTeam);
router.patch(
  '/:projId/team/:teamId',
  isAdmin,
  ProjectController.handleUpdateTeam
);

module.exports = router;
