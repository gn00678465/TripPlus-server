const { getUser, editUser, updatePassword } = require('./account');
const { addFollow } = require('./follows');

module.exports.getUser = getUser;
module.exports.editUser = editUser;
module.exports.updatePassword = updatePassword;
module.exports.addFollow = addFollow;
