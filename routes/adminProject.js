const express = require('express');
const router = express.Router();

const { isAdmin } = require('../services/auth');

const ProjectController = require('../controllers/adminProject');

router.post('/', isAdmin, ProjectController.handleCreateProject);
router.post('/:id/plan', isAdmin, ProjectController.handleCreateProjectPlan);
router.post('/:id/news', isAdmin, ProjectController.handleCreateProjectNews);
router.post('/:id/faqs', isAdmin, ProjectController.handleCreateProjectFaqs);
router.post(
  '/:id/transform',
  isAdmin,
  ProjectController.handleConvertIntoProduct
);
router.post(
  '/:id/update-history',
  isAdmin,
  ProjectController.handleCreateProjectHistory
);

router.get('/', isAdmin, ProjectController.handleReadAdminProject);
router.get('/:projId/team/:teamId', isAdmin, ProjectController.handleReadTeam);
router.get('/:id/info', isAdmin, ProjectController.handleReadProject);
router.get('/:id/content', isAdmin, ProjectController.handleReadProjectContent);
router.get('/:id/plan', isAdmin, ProjectController.handleReadProjectPlan);
router.get('/:id/news', isAdmin, ProjectController.handleReadProjectNews);
router.get('/:id/faqs', isAdmin, ProjectController.handleReadProjectFaqs);
router.get(
  '/:id/update-history',
  isAdmin,
  ProjectController.handleReadProjectHistory
);

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
router.patch(
  '/:projId/news/:newsId',
  isAdmin,
  ProjectController.handleUpdateProjectNews
);
router.patch(
  '/:projId/faqs/:faqsId',
  isAdmin,
  ProjectController.handleUpdateProjectFaqs
);

router.delete(
  '/:projId/plan/:planId',
  isAdmin,
  ProjectController.handleDeleteProjectPlan
);
router.delete(
  '/:projId/news/:newsId',
  isAdmin,
  ProjectController.handleDeleteProjectNews
);
router.delete(
  '/:projId/faqs/:faqsId',
  isAdmin,
  ProjectController.handleDeleteProjectFaqs
);

module.exports = router;
