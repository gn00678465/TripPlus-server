const mongoose = require('mongoose');

const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Team = require('../../models/teamsModel');

const handleCreateProject = handleErrorAsync(async (req, res, next) => {
  const { title, teamName, category, startTime, endTime, target } = req.body;

  //必填欄位
  if (!title || !teamName || !category || !startTime || !endTime || !target) {
    return next(
      appError(
        400,
        '以下欄位不可爲空：專案名稱、提案團隊、專案類型、募資開始時間、募資結束時間、目標金額'
      )
    );
  }

  // isNumber
  if (!validator.isInt(target)) {
    return next(appError(400, '目標金額應為整數數值'));
  }

  if (!validator.isNumeric(category)) {
    return next(appError(400, 'category 格式不正確，請聯絡管理員'));
  }

  //is date & time
  if (!validator.isISO8601(startTime) || !validator.isISO8601(endTime)) {
    return next(appError(400, '募資開始時間或募資結束時間格式不正確'));
  }

  //募資結束時間 大於 募資開始時間
  if (!validator.isAfter(endTime, { comparisonDate: startTime })) {
    return next(appError(400, '募資結束時間應晚於募資開始時間'));
  }

  const newTeam = await Team.create({
    title: teamName
  });

  if (!newTeam || !newTeam?._id) {
    return next(appError(500, '建立團隊資料發生錯誤，請聯絡管理員'));
  }

  const newProject = await Project.create({
    creator: req.user._id,
    title,
    teamId: newTeam._id,
    startTime,
    endTime,
    target
  });

  if (!newProject) {
    return next(appError(500, '新增專案資料發生錯誤，請聯絡管理員'));
  }

  successHandler(res, '新增募資專案成功', newProject);
});

module.exports = handleCreateProject;
