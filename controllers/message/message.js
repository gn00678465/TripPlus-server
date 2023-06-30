const ObjectId = require('mongoose').Types.ObjectId;
const successHandler = require('../../services/successHandler');
const appError = require('../../services/appError');
const handleErrorAsync = require('../../services/handleErrorAsync');
const isPositiveInteger = require('../../helper/isPositiveInteger');
const Message = require('../../models/messagesModel');
const Room = require('../../models/roomsModel');
const Project = require('../../models/projectsModel');

const defaultPageSize = 10;
const defaultPageIndex = 1;

const getChatRoomMessages = handleErrorAsync(async (req, res, next) => {
  const { id } = req.user;
  const { roomId } = req.params;
  const { pageIndex, pageSize } = req.query;
  const currentPageIndex = isPositiveInteger(pageIndex)
    ? pageIndex
    : defaultPageIndex;
  const currentPageSize = isPositiveInteger(pageSize)
    ? pageSize
    : defaultPageSize;
  if (!roomId || !ObjectId.isValid(roomId)) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const room = await Room.findById(roomId);
  if (!room) {
    return next(appError(400, '查無此聊天室窗'));
  }
  const messages = await Message.find({
    $and: [
      { roomId },
      {
        $or: [{ sender: id }, { receiver: id }]
      }
    ]
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
    .skip((currentPageIndex - 1) * currentPageSize)
    .limit(currentPageSize);

  successHandler(res, '取得訊息', messages);
});
const getProjectMsgOrCreateRoom = handleErrorAsync(async (req, res, next) => {
  const { projectId } = req.params;
  const { id } = req.user;
  const { pageIndex, pageSize } = req.query;
  const currentPageIndex = isPositiveInteger(pageIndex)
    ? pageIndex
    : defaultPageIndex;
  const currentPageSize = isPositiveInteger(pageSize)
    ? pageSize
    : defaultPageSize;
  if (!projectId || !ObjectId.isValid(projectId)) {
    return next(appError(400, '路由資訊錯誤'));
  }
  const project = await Project.findById(projectId);
  if (!project) {
    return next(appError(400, '查無此專案'));
  }
  const room = await Room.findOne({
    $and: [
      {
        participants: req.user
      },
      { projectId: projectId }
    ]
  });
  if (!room) {
    const newRoom = await Room.create({
      participants: [req.user, project.creator],
      projectId,
      projectCreator: project.creator
    });
    successHandler(res, '建立新的聊天室窗', newRoom);
  } else {
    const messages = await Message.find({
      $and: [
        { roomId: room.id },
        {
          $or: [{ sender: id }, { receiver: id }]
        }
      ]
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
          select: 'title creator teamId',
          populate: {
            path: 'teamId',
            select: 'title'
          }
        }
      })
      .sort({ createdAt: -1 })
      .skip((currentPageIndex - 1) * currentPageSize)
      .limit(currentPageSize);
    if (!messages || messages.length === 0) {
      return successHandler(res, '尚未建立訊息', room);
    }
    successHandler(res, '取得訊息', messages);
  }
});

module.exports = {
  getChatRoomMessages,
  getProjectMsgOrCreateRoom
};
