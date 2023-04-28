const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const handleErrorAsync = require('../../services/handleErrorAsync');
const appError = require('../../services/appError');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadFromBuffer = (req) => {
  return new Promise((resolve, reject) => {
    let cld_upload_stream = cloudinary.uploader.upload_stream(
      { folder: 'TripPlus' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
  });
};

const handleUpload = handleErrorAsync(async (req, res, next) => {
  if (!req.file) {
    return next(appError(400, '請上傳檔案'));
  }

  await uploadFromBuffer(req)
    .then((image) => {
      res.status(200).json({
        status: 'Success',
        message: '圖片上傳成功',
        data: {
          imageUrl: image.secure_url
        }
      });
    })
    .catch((err) => {
      return next(appError(500, '圖片上傳失敗'));
    });
});

module.exports.handleUpload = handleUpload;
