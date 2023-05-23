const successHandler = require('../../services/successHandler');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');
const Product = require('../../models/productsModel');

const getProjects = handleErrorAsync(async (req, res, next) => {
  const projects = await Project.find({ isAbled: 1 });
  const products = await Product.find({ isAbled: 1 });

  const result = {
    hot: projects.sort((a, b) => b.sponsorCount - a.sponsorCount),
    latest: projects.sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    ),
    classic: products.filter((item) => item.isSelected),
    success: projects.filter((item) => item.status === 'complete')
  };
  successHandler(res, '取得首頁專案成功', result);
});

module.exports = getProjects;
