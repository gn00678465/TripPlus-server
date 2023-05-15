const validator = require('validator');

const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Team = require('../../models/teamsModel');
const phoneRule =
  /(\d{2,3}-?|\(\d{2,3}\))\d{3,4}-?\d{4}|09\d{2}(\d{6}|-\d{3}-\d{3})/;
const instagramRule = /^[\w](?!.*?\.{2})[\w.]{1,28}[\w]$/;

const handleUpdateTeam = handleErrorAsync(async (req, res, next) => {
  const { projId, teamId } = req.params;
  if (!projId || !teamId) {
    return next(appError(400, '路由資訊錯誤'));
  }

  const proj = await Project.findById(projId);

  if (!proj) {
    return next(appError(400, '專案資料錯誤'));
  }

  if (proj.teamId.toString() !== teamId) {
    return next(appError(400, '專案或團隊資料錯誤'));
  }

  const {
    type,
    title,
    photo,
    introduction,
    taxId,
    address,
    serviceTime,
    representative,
    email,
    phone,
    website,
    facebook,
    instagram
  } = req.body;

  const errArray = [];
  if (!title) {
    errArray.push('提案者名稱為必填欄位');
  }

  if (
    (type === 0 ? '0' : type) &&
    !validator.isIn(type.toString(), ['0', '1'])
  ) {
    errArray.push('“提案者類型”格式錯誤，請聯絡管理員');
  }

  if (photo && !validator.isURL(photo)) {
    errArray.push('提案者照片連結格式錯誤');
  }

  if (
    taxId &&
    (!validator.isInt(taxId) || !validator.isLength(taxId, { min: 8, max: 8 }))
  ) {
    errArray.push('統一編號格式錯誤');
  }

  if (email && !validator.isEmail(email)) {
    errArray.push('email 格式錯誤');
  }

  if (phone && !phoneRule.test(phone)) {
    errArray.push('電話格式錯誤');
  }

  if (website && !validator.isURL(website)) {
    errArray.push('website 連結格式錯誤');
  }

  if (facebook && !validator.isURL(facebook)) {
    errArray.push('facebook 連結格式錯誤');
  }

  if (instagram && !instagramRule.test(instagram)) {
    errArray.push('instagram 帳號格式錯誤');
  }

  if (errArray.length > 0) {
    return next(appError(400, errArray.join('&')));
  }

  const updatedTeam = await Team.findByIdAndUpdate(teamId, req.body, {
    new: true,
    runValidators: true
  });
  if (!updatedTeam) {
    return next(appError(500, '編輯團隊資料失敗'));
  }
  successHandler(res, '編輯團隊資料成功', updatedTeam);
});

module.exports = handleUpdateTeam;
