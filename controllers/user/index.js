const { getUser, editUser, updatePassword } = require('./account');
const { getFollows, addFollow } = require('./follows');

module.exports.getUser = getUser;
module.exports.editUser = editUser;
module.exports.updatePassword = updatePassword;
module.exports.getFollows = getFollows;
module.exports.addFollow = addFollow;
