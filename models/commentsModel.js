const mongoose = require('mongoose');
const commentSchema = mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'orders'
    },
    productId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'products'
    },
    writer: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: 'users'
    },
    rate: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    shortComment: {
      type: String,
      enum: [
        '符合期待',
        '質感優異',
        '運送迅速',
        '想再回購',
        '服務貼心',
        '風格獨特'
      ]
    },
    comment: {
      type: String
    },
    imageUrls: {
      type: Array
    }
  },
  { timestamps: true }
);

commentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'writer',
    select: 'name id'
  });
  next();
});

const Comment = mongoose.model('comments', commentSchema);
module.exports = Comment;
