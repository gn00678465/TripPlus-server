const Message = require('../models/messagesModel');
const appError = require('../services/appError');

// 建立 WebSocket 連接
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', async (messagePayload) => {
      const { sender, receiver, content, projectId } = messagePayload;
      if (!sender || !receiver || !content || !projectId) {
        return io.emit(
          'error',
          '以下欄位不可爲空：接收者 id、聊天訊息、專案 id 不可為空'
        );
      }
      try {
        const message = await Message.create({
          sender,
          receiver,
          content,
          projectId
        });
        io.emit('message', { ...messagePayload });
      } catch (error) {
        console.log(error);
      }
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
