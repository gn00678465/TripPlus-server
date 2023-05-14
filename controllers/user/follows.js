const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const successHandler = require('../../services/successHandler');
const User = require('../../models/usersModel');
const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');

const getFollows = handleErrorAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).populate(
    'follows.projectId follows.productId'
  );
  if (!user) {
    return next(appError(400, '查無此使用者'));
  }
  successHandler(res, '取得追蹤明細成功', { follows: user.follows });
});

const addFollow = handleErrorAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  const project = await Project.findById(id);
  const product = await Product.findById(id);
  if (!project && !product) {
    return next(appError(400, '查無專案或商品'));
  }
  const follows = {};
  if (project) {
    follows.projectId = project._id;
  }
  if (product) {
    follows.productId = product._id;
  }
  isFollowed = user.follows.some((item) =>
    item.projectId
      ? item.projectId.equals(follows.projectId)
      : item.productId.equals(follows.productId)
  );
  if (isFollowed) {
    return next(appError(400, '專案或商品已在追蹤明細'));
  }
  const updatedUserFollow = await User.findByIdAndUpdate(
    req.user.id,
    { $addToSet: { follows } },
    { new: true }
  );
  if (!updatedUserFollow) {
    return next(appError(500, '新增追蹤失敗'));
  }
  successHandler(res, '已加入追蹤', { follows: updatedUserFollow.follows });
});
const removeFollow = handleErrorAsync(async (req, res, next) => {
  const { id } = req.params;
  const user = await User.findById(req.user.id);
  const project = await Project.findById(id);
  const product = await Product.findById(id);

  if (!project && !product) {
    return next(appError(400, '查無專案或商品'));
  }
  const follows = {};
  if (project) {
    follows.projectId = project._id;
  }
  if (product) {
    follows.productId = product._id;
  }
  const followIndex = user.follows.findIndex((item) =>
    item.projectId
      ? item.projectId.equals(follows.projectId)
      : item.productId.equals(follows.productId)
  );
  if (followIndex === -1) {
    return next(appError(400, '專案或商品未加入追蹤'));
  }
  const updatedUserFollow = await User.findByIdAndUpdate(
    req.user.id,
    { $pull: { follows } },
    { new: true }
  );
  if (!updatedUserFollow) {
    return next(appError(500, '取消追蹤失敗'));
  }
  successHandler(res, '取消追蹤', { follows: updatedUserFollow.follows });
});

module.exports = { getFollows, addFollow, removeFollow };
