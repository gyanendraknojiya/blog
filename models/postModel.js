const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  Created_at: {
    type: String,
    required: true,
  },
  Edited_at: {
    type: String,
  },
  author: {
    type: String,
  },
});

const Post = new mongoose.model("Post", postSchema);

module.exports = Post;
