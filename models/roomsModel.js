const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.ObjectId, ref: 'users' }],
    projectId: {
      type: mongoose.Schema.ObjectId,
      required: [true, '請填寫專案 id'],
      ref: 'projects'
    },
    projectCreator: {
      type: String
    }
  },
  { timestamps: true }
);

const Room = new mongoose.model('rooms', roomSchema);
module.exports = Room;
