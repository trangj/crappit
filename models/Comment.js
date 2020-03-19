const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: String,
  date: { type: Date, default: Date.now },
  post: { type: Schema.Types.ObjectId, ref: "Post" },
  author: String
});

module.exports = Comment = mongoose.model("Comment", commentSchema);
