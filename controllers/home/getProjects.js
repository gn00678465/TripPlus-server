const successHandler = require('../../services/successHandler');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');

const getProjects = handleErrorAsync(async (req, res, next) => {
  const projects = await Project.find({ isAbled: 1 }).populate({
    path: 'teamId',
    select: 'title'
  });

  const products = await Product.find({ isAbled: 1 }).populate({
    path: 'teamId',
    select: 'title'
  });

  const result = {
    hot: projects.sort((a, b) => b.sponsorCount - a.sponsorCount).slice(0, 3),
    latest: projects
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3),
    classic: products.filter((item) => item.isSelected).slice(0, 3),
    success: projects.filter((item) => item.status === 'complete').slice(0, 6)
  };
  successHandler(res, '取得首頁專案成功', result);
});

module.exports = getProjects;
