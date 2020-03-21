const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = new Schema({
  title: String,
  description: String,
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  date: { type: Date, default: Date.now }
});

module.exports = Topic = mongoose.model("Topic", topicSchema);
