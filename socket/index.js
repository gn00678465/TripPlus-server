const Message = require('../models/messagesModel');

// 建立 WebSocket 連接
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', async (messagePayload) => {
      const { sender, receiver, content, projectId } = messagePayload;
      const message = await Message.create({
        sender,
        receiver,
        content,
        projectId
      });
      io.emit('message', { ...messagePayload });
    });

    socket.on('disconnect', () => {
      console.log('A user disconnected');
    });
  });
};
