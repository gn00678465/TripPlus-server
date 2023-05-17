const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const handleReadProjectContent = handleErrorAsync(async (req, res, next) => {
  const { content } = req.body;
  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(req.params.id);
  if (!proj) {
    return next(appError(400, '查無專案'));
  }

  if (!Object.keys(req.body).includes('content')) {
    return next(appError(400, '無内文資訊'));
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    {
      content
    },
    { new: true, runValidators: true }
  );
  if (!updatedProject) {
    return next(appError(500, '編輯專案内文失敗'));
  }

  successHandler(res, '編輯專案内文成功', {
    content: updatedProject.content ?? ''
  });
});

module.exports = handleReadProjectContent;
