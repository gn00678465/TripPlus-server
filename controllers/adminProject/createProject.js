const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Team = require('../../models/teamsModel');

const handleCreateProject = handleErrorAsync(async (req, res, next) => {
  const { title, teamName, category, startTime, endTime, target } = req.body;

  //必填欄位
  if (
    !title ||
    !teamName ||
    !(category === 0 ? '0' : category) ||
    !startTime ||
    !endTime ||
    !target
  ) {
    return next(
      appError(
        400,
        '以下欄位不可爲空：專案名稱、提案團隊、專案類型、募資開始時間、募資結束時間、目標金額'
      )
    );
  }

  const errArray = [];
  // isNumber
  if (!validator.isInt(target.toString(), { gt: 0 })) {
    errArray.push('目標金額應為大於 0 的整數數值');
  }

  if (!validator.isIn(category.toString(), ['0', '1', '2'])) {
    errArray.push('“專案類型”格式不正確，請聯絡管理員');
  }

  //is date & time
  if (!validator.isISO8601(startTime) || !validator.isISO8601(endTime)) {
    errArray.push('募資開始時間或募資結束時間格式不正確');
  }

  //募資結束時間 大於 募資開始時間
  if (!validator.isAfter(endTime, { comparisonDate: startTime })) {
    errArray.push('募資結束時間應晚於募資開始時間');
  }

  if (errArray.length > 0) {
    return next(appError(400, errArray.join('&')));
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
