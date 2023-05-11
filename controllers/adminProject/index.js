const handleCreateProject = require('./createProject');
const handleCreateProjectPlan = require('./createProjectPlan');
const handleCreateProjectNews = require('./createProjectNews');
const handleReadProject = require('./readProject');
const handleReadTeam = require('./readTeam');
const handleReadProjectContent = require('./readProjectContent');
const handleReadProjectPlan = require('./readProjectPlan');
const handleReadProjectNews = require('./readProjectNews');
const handleUpdateTeam = require('./updateProjectTeam');
const handleUpdateProjectSetting = require('./updateProjectSetting');
const handleUpdateProjectImage = require('./updateProjectImage');
const handleUpdateProjectPayment = require('./updateProjectPayment');
const handleUpdateProjectContent = require('./updateProjectContent');
const handleUpdateProjectPlan = require('./updateProjectPlan');
const handleDeleteProjectPlan = require('./deleteProjectPlan');

module.exports.handleCreateProject = handleCreateProject;
module.exports.handleCreateProjectPlan = handleCreateProjectPlan;
module.exports.handleCreateProjectNews = handleCreateProjectNews;
module.exports.handleReadProject = handleReadProject;
module.exports.handleReadTeam = handleReadTeam;
module.exports.handleReadProjectContent = handleReadProjectContent;
module.exports.handleReadProjectPlan = handleReadProjectPlan;
module.exports.handleReadProjectNews = handleReadProjectNews;
module.exports.handleUpdateProjectSetting = handleUpdateProjectSetting;
module.exports.handleUpdateTeam = handleUpdateTeam;
module.exports.handleUpdateProjectImage = handleUpdateProjectImage;
module.exports.handleUpdateProjectPayment = handleUpdateProjectPayment;
module.exports.handleUpdateProjectContent = handleUpdateProjectContent;
module.exports.handleUpdateProjectPlan = handleUpdateProjectPlan;
module.exports.handleDeleteProjectPlan = handleDeleteProjectPlan;
