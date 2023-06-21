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
  const chatRooms = await Room.find({
    $and: [{ projectId }, { participants: id }]
  });
  if (!chatRooms || chatRooms.length === 0) {
    return next(appError(400, '查無聊天訊息'));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(appError(400, '查無此專案'));
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
      const customerId =
        message[0].sender._id !== id
          ? message[0].sender._id
          : message[0].receiver._id;

      messages.push({ customerId, message });
    }
  }
  successHandler(res, '取得 ChatRoom 成功', messages);
});
module.exports = { getUserChatroom, getAminChatroom };
