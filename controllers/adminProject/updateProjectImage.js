const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');

const handleUpdateProjectImage = handleErrorAsync(async (req, res, next) => {
  const { keyVision, video } = req.body;

  if (!req.params.id) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const errArray = [];
  if (keyVision && !validator.isURL(keyVision)) {
    errArray.push('主視覺連結錯誤');
  }

  if (video && !validator.isURL(video)) {
    errArray.push('集資影片連結錯誤');
  }

  if (errArray.length > 0) {
    return next(appError(400, errArray.join('&')));
  }

  const updatedProject = await Project.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!updatedProject) {
    //updatedProject 會是舊資料
    return next(appError(500, '編輯主視覺資料失敗'));
  }

  successHandler(res, '編輯主視覺資料成功', updatedProject);
});

module.exports = handleUpdateProjectImage;
