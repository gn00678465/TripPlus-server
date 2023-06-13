const {
  createMessages,
  getMemberMessages,
  getProjectMessages,
  getAdminProjectMessages
} = require('./message');

module.exports.createMessages = createMessages;
module.exports.getMemberMessages = getMemberMessages;
(module.exports.getProjectMessages = getProjectMessages),
  (module.exports.getAdminProjectMessages = getAdminProjectMessages);
