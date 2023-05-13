const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Product = require('../../models/productsModel');
const Team = require('../../models/teamsModel');

const getTeam = handleErrorAsync(async (req, res, next) => {
  const { productId, teamId } = req.params;
  if (!productId || !teamId) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const product = await Product.findById(productId);
  const team = await Team.findById(teamId);
  if (!productId) {
    return next(appError(400, '商品資料錯誤'));
  }
  if (product.teamId.toString() !== teamId) {
    return next(appError(400, '商品或團隊資料錯誤'));
  }
  if (!team) {
    return next(appError(400, '取得團隊資料失敗'));
  }
  successHandler(res, '取得團隊資料成功', team);
});
module.exports = getTeam;
