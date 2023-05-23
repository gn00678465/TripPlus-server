const successHandler = require('../../services/successHandler');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Project = require('../../models/projectsModel');

const getData = handleErrorAsync(async (req, res, next) => {
  const projects = await Project.find({ isAbled: 1 });

  const successProj = projects.filter((item) => item.status === 'complete');

  const sum = projects.reduce((acc, cur) => acc + cur.sum, 0);

  const sponsorCount = projects.reduce((acc, cur) => acc + cur.sponsorCount, 0);

  const result = {
    successCount: successProj.length,
    sum,
    sponsorCount
  };

  successHandler(res, '取得首頁統計資料成功', result);
});

module.exports = getData;
