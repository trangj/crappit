const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: String,
  content: String,
  topic: String,
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Post" }
});

module.exports = Comment = mongoose.model("Comment", commentSchema);
