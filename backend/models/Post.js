const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    image: { type: String },
    describe: { type: String },
    content: [
      {
        text: { type: String,}, // Nội dung chính
      }
    ],
    link: { type: String },
    createdAt: { type: Date, default: Date.now },
  }
);

module.exports = mongoose.model('Post', PostSchema);
  