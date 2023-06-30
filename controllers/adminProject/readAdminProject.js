const validator = require('validator');
const successHandler = require('../../services/successHandler');

const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');

const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');

const handleReadAdminProject = handleErrorAsync(async (req, res, next) => {
  const {
    page = '1',
    limit = '10',
    type,
    status,
    query,
    sortStatus,
    sortType,
    sortTitle,
    sortTeam,
    sortSum
  } = req.query;

  if (!validator.isInt(page, { gt: 0 }) || !validator.isInt(limit, { gt: 0 })) {
    return next(appError(400, '路由資訊錯誤，page 或 limit 資料錯誤'));
  }

  if (type && !validator.isIn(type, ['project', 'product'])) {
    return next(appError(400, '路由資訊錯誤，category 資料錯誤'));
  }

  if (status && !validator.isIn(status, ['draft', 'progress', 'complete'])) {
    return next(appError(400, '路由資訊錯誤， status 資料錯誤'));
  }

  if (sortStatus && !validator.isIn(sortStatus, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortStatus 資料錯誤'));
  }

  if (sortType && !validator.isIn(sortType, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortType 資料錯誤'));
  }

  if (sortTitle && !validator.isIn(sortTitle, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortTitle 資料錯誤'));
  }

  if (sortTeam && !validator.isIn(sortTeam, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortTeam 資料錯誤'));
  }

  if (sortSum && !validator.isIn(sortSum, ['asc', 'desc'])) {
    return next(appError(400, '路由資訊錯誤， sortSum 資料錯誤'));
  }

  const projList = await Project.find({ creator: req.user._id }).populate({
    path: 'teamId',
    select: 'title'
  });

  const prodList = await Product.find({ creator: req.user._id }).populate({
    path: 'teamId',
    select: 'title'
  });

  let allList = projList.concat(prodList).sort((a, b) => {
    return Date.parse(a.createdAt) - Date.parse(b.createdAt);
  });

  if (type) {
    allList = allList.filter((x) => x.type === type);
  }

  if (status) {
    allList = allList.filter((x) => x.status === status);
  }

  if (query) {
    allList = allList.filter(
      (x) => x.title.includes(query) || x.teamId.title.includes(query)
    );
  }

  if (sortStatus === 'asc') {
    allList.sort((a, b) => {
      return a.status.localeCompare(b.status);
    });
  } else if (sortStatus === 'desc') {
    allList.sort((a, b) => {
      return b.status.localeCompare(a.status);
    });
  }

  if (sortType === 'asc') {
    allList.sort((a, b) => {
      return a.type.localeCompare(b.type);
    });
  } else if (sortType === 'desc') {
    allList.sort((a, b) => {
      return b.type.localeCompare(a.type);
    });
  }

  if (sortTitle === 'asc') {
    allList.sort((a, b) => {
      return a.title.localeCompare(b.title, 'zh-Hant');
    });
  } else if (sortTitle === 'desc') {
    allList.sort((a, b) => {
      return b.title.localeCompare(a.title, 'zh-Hant');
    });
  }

  if (sortTeam === 'asc') {
    allList.sort((a, b) => {
      return a.teamId.title.localeCompare(b.teamId.title, 'zh-Hant');
    });
  } else if (sortTeam === 'desc') {
    allList.sort((a, b) => {
      return b.teamId.title.localeCompare(a.teamId.title, 'zh-Hant');
    });
  }

  if (sortSum === 'asc') {
    allList.sort((a, b) => {
      return a.sum - b.sum;
    });
  } else if (sortSum === 'desc') {
    allList.sort((a, b) => {
      return b.sum - a.sum;
    });
  }

  const pageN = Number(page);
  const limitN = Number(limit);
  const items = allList.slice((pageN - 1) * limitN, pageN * limitN);
  const total = allList.length;
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

  successHandler(res, '取得管理者專案列表成功', result);
});

module.exports = handleReadAdminProject;
