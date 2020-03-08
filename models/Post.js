const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Post = mongoose.model("Post", postSchema);
