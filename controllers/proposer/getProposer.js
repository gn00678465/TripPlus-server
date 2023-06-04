const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Team = require('../../models/teamsModel');

const getProposer = handleErrorAsync(async (req, res, next) => {
  const { teamId } = req.params;
  if (!teamId || !ObjectId.isValid(teamId)) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const team = await Team.findById(teamId);

  if (!team) {
    return next(appError(500, '取得提案者資料失敗'));
  }

  const proj = await Project.find({ teamId: teamId });

  const projects = {
    all: proj.filter((item) => item.isAbled !== 0),
    progress: proj.filter((item) => item.status === 'progress'),
    complete: proj.filter(
      (item) => item.status === 'complete' && item.progressRate >= 100
    )
  };

  const result = {
    team,
    projects
  };

  successHandler(res, '取得提案者資料成功', result);
});

module.exports = getProposer;
