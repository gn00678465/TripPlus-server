const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Team = require('../../models/teamsModel');

const handleReadTeam = handleErrorAsync(async (req, res, next) => {
  const { projId, teamId } = req.params;
  if (!projId || !teamId) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(projId);
  const team = await Team.findById(teamId);

  if (!proj) {
    return next(appError(400, '專案資料錯誤'));
  }

  if (proj.teamId.toString() !== teamId) {
    return next(appError(400, '專案或團隊資料錯誤'));
  }

  if (!team) {
    return next(appError(400, '取得團隊資料失敗'));
  }

  successHandler(res, '取得團隊資料成功', team);
});

module.exports = handleReadTeam;
