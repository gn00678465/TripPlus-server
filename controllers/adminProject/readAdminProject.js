const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');

const handleReadAdminProject = handleErrorAsync(async (req, res, next) => {
  const projects = await Project.find({ creator: req.user._id })
    .populate({ path: 'teamId', select: 'title' })
    .populate({ path: 'histories', select: 'status createdAt' });
  successHandler(res, '取得管理者專案列表成功', projects);
});

module.exports = handleReadAdminProject;
