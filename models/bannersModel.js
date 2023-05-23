const mongoose = require('mongoose');
const bannersSchema = mongoose.Schema({
  title: {
    type: String
  },
  subtitle: {
    type: String
  },
  imageUrl: {
    type: String
  }
});

const Banners = mongoose.model('banners', bannersSchema);
module.exports = Banners;
