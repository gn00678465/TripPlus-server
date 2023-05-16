const { getUser, editUser, updatePassword } = require('./account');
const { getFollows, addFollow, removeFollow } = require('./follows');
const { getOrders, getOrderDetails } = require('./orders');

module.exports.getUser = getUser;
module.exports.editUser = editUser;
module.exports.updatePassword = updatePassword;
module.exports.getFollows = getFollows;
module.exports.addFollow = addFollow;
module.exports.removeFollow = removeFollow;
module.exports.getOrders = getOrders;
module.exports.getOrderDetails = getOrderDetails;
