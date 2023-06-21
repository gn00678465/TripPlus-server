const Message = require('../models/messagesModel');

// 建立 WebSocket 連接
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinRoom', function (roomId) {
      socket.join(roomId);
    });

    socket.on('message', async (messagePayload) => {
      const { sender, receiver, content, roomId } = messagePayload;
      if (!sender || !receiver || !content || !roomId) {
        return io.emit(
          'error',
          '以下欄位不可爲空：接收者 id、聊天訊息、room id 不可為空'
        );
      }
      console.log(messagePayload);
      try {
        const message = await Message.create({
          sender,
          receiver,
          content,
          roomId
        });
        io.emit('message', { ...messagePayload });
      } catch (error) {
        io.emit(error);
      }
    });

    socket.on('leaveRoom', function (roomId) {
      socket.leave(roomId);
    });
  });
};
