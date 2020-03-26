const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  author: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, required: true },
  content: { type: String, required: true },
  topic: { type: String, required: true },
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  date: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Post" }
});

module.exports = Comment = mongoose.model("Comment", commentSchema);
