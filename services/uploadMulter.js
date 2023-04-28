const multer = require('multer');
const path = require('path');
const appError = require('./appError');

const uploadMulter = multer({
  limits: {
    fileSize: 83886080 //10mb
  },
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback(appError(400, '檔案格式錯誤，請上傳圖片檔案'));
    }
    callback(null, true);
  }
}).single('file');

module.exports = uploadMulter;
