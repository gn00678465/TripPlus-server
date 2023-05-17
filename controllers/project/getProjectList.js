const validator = require('validator');
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const handleGetProjectList = handleErrorAsync(async (req, res, next) => {
  const { sort, category } = req.query;
  let projList = await Project.find({ isAbled: 1 }).populate({
    path: 'teamId',
    select: 'title'
  });

  if (
    sort &&
    !validator.isIn(sort, [
      'recently_launched',
      'recently_ending',
      'all',
      'project_backers'
    ])
  ) {
    return next(appError(400, '路由資訊錯誤'));
  }

  if (category && !validator.isIn(category, ['0', '1', '2'])) {
    return next(appError(400, '路由資訊錯誤'));
  }

  //最新上線
  if (sort === 'recently_launched') {
    projList.sort((a, b) => {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt); //desc
    });
  }

  //即將結束
  if (sort === 'recently_ending') {
    projList = projList
      .filter((x) => Date.parse(x.endTime) > Date.now()) //募資未結束
      .sort((a, b) => {
        return a.countDownDays - b.countDownDays; //asc
      });
  }

  //專案人次
  if (sort === 'project_backers') {
    projList.sort((a, b) => {
      //desc
      return b.sponsorCount - a.sponsorCount;
    });
  }

  if (category === '0') {
    projList = projList.filter((x) => x.category === 0);
  }

  if (category === '1') {
    projList = projList.filter((x) => x.category === 1);
  }

  if (category === '2') {
    projList = projList.filter((x) => x.category === 2);
  }

  successHandler(res, '取得專案列表成功', projList);
});

module.exports = handleGetProjectList;
