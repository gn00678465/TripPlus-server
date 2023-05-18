const validator = require('validator');
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const handleGetProjectList = handleErrorAsync(async (req, res, next) => {
  const { sort, category, page = '1', limit = '10' } = req.query;
  let projList = await Project.find({ isAbled: 1 }).populate({
    path: 'teamId',
    select: 'title'
  });

  if (
    sort &&
    !validator.isIn(sort, [
      'hot_project',
      'recently_launched',
      'recently_ending',
      'all',
      'project_backers'
    ])
  ) {
    return next(appError(400, '路由資訊錯誤，sort 資料錯誤'));
  }

  if (category && !validator.isIn(category, ['0', '1', '2'])) {
    return next(appError(400, '路由資訊錯誤，category 資料錯誤'));
  }

  if (!validator.isInt(page) || !validator.isInt(limit)) {
    return next(appError(400, '路由資訊錯誤，page 或 limit 資料錯誤'));
  }

  if (sort === 'recently_launched') {
    //最新上線
    projList.sort((a, b) => {
      return Date.parse(b.createdAt) - Date.parse(a.createdAt); //desc
    });
  } else if (sort === 'recently_ending') {
    //即將結束
    projList = projList
      .filter((x) => Date.parse(x.endTime) > Date.now()) //募資未結束
      .sort((a, b) => {
        return a.countDownDays - b.countDownDays; //asc
      });
  } else if (sort === 'project_backers') {
    //專案人次
    projList.sort((a, b) => {
      //desc
      return b.sponsorCount - a.sponsorCount;
    });
  } else if (sort === 'hot_project') {
    //熱門專案
    projList = projList
      .filter((x) => x.sponsorCount >= 10)
      .sort((a, b) => {
        //desc
        return b.sponsorCount - a.sponsorCount;
      });
  }

  if (category) {
    projList = projList.filter((x) => x.category == category);
  }

  const pageN = Number(page);
  const limitN = Number(limit);
  const items = projList.slice((pageN - 1) * limitN, pageN * limitN);
  const total = projList.length;
  const totalPages = Math.ceil(total / limitN);

  const result = {
    total,
    totalPages,
    page: pageN,
    items,
    startIndex: (pageN - 1) * limitN + 1,
    endIndex: (pageN - 1) * limitN + items.length,
    limit: limitN
  };

  successHandler(res, '取得專案列表成功', result);
});

module.exports = handleGetProjectList;
