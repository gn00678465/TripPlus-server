const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const Room = require('../../models/roomsModel');
const Message = require('../../models/messagesModel');
const Project = require('../../models/projectsModel');

const getUserChatroom = handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  const chatRooms = await Room.find({
    participants: id
  });
  if (!chatRooms || chatRooms.length === 0) {
    return next(appError(400, '查無聊天訊息'));
  }

  const messages = [];

  for (const chatRoom of chatRooms) {
    const message = await Message.find({
      roomId: chatRoom.id
    })
      .populate({
        path: 'sender',
        select: 'name nickName photo'
      })
      .populate({
        path: 'receiver',
        select: 'name nickName photo'
      })
      .populate({
        path: 'roomId',
        populate: {
          path: 'projectId',
          select: 'title creator'
        }
      })
      .sort({ createdAt: -1 })
      .limit(1);

    if (message.length > 0) {
      messages.push(message[0]);
    }
  }
  successHandler(res, '取得 ChatRoom 成功', messages);
});
const getAminChatroom = handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  const { projectId } = req.params;
  const rooms = await Room.find({
    $and: [{ projectId }, { participants: id }]
  });
  const proj = await Project.findById(projectId);
  if (proj.creator?.toString() !== id) {
    return next(appError(403, '您無權限'));
  }
  if (!rooms || rooms.length === 0) {
    return next(appError(400, '查無聊天訊息'));
  }
  if (!proj) {
    return next(appError(400, '查無此專案'));
  }
  const project = {
    title: proj.title,
    keyVision: proj.keyVision,
    creator: proj.creator
  };
  const result = {
    project,
    chatRooms: []
  };
  for (const chatRoom of rooms) {
    const message = await Message.find({
      roomId: chatRoom.id
    })
      .populate({
        path: 'sender',
        select: 'name nickName photo'
      })
      .populate({
        path: 'receiver',
        select: 'name nickName photo'
      })
      .populate({
        path: 'roomId'
      })
      .sort({ createdAt: -1 })
      .limit(1);

    if (message.length > 0) {
      const customerId =
        message[0].sender._id !== chatRoom.projectCreator
          ? message[0].sender._id
          : message[0].receiver._id;

      result.chatRooms.push({ customerId, message });
    }
  }
  successHandler(res, '取得 ChatRoom 成功', result);
});
module.exports = { getUserChatroom, getAminChatroom };
