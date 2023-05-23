const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Message = require('../../models/messagesModel');
const Project = require('../../models/projectsModel');

const createMessages = handleErrorAsync(async (req, res, next) => {
  const { receiver, content, projectId } = req.body;
  const { id } = req.user;
  if (!receiver || !content || !projectId) {
    return next(
      appError(400, '以下欄位不可爲空：接收者 id、聊天訊息、專案 id 不可為空')
    );
  }
  const project = await Project.findById(projectId);

  if (!project) {
    appError(400, '查無此專案');
  }
  if (project.creator?.toString() !== receiver) {
    appError(400, '查無此專案發起人');
  }
  const newMessage = await Message.create({
    sender: id,
    receiver,
    content,
    projectId
  });
  if (!newMessage) {
    return next(appError(500, '新增訊息失敗'));
  }
  successHandler(res, '新增訊息成功', newMessage);
});
const getMemberMessages = handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  const messages = await Message.find({
    $or: [{ sender: id }, { receiver: id }]
  })
    .populate({
      path: 'sender',
      select: 'name nickName photo'
    })
    .populate({
      path: 'receiver',
      select: 'name nickName photo'
    })
    .sort({ createdAt: -1 });

  if (!messages) {
    return next(appError(500, '查無相關訊息'));
  }
  successHandler(res, '取得訊息', messages);
});

module.exports = { createMessages, getMemberMessages };
