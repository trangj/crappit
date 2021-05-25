const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const topicSchema = new Schema({
	title: { type: String, required: true, unique: true },
	description: { type: String, required: true },
	imageURL: String,
	imageName: String,
	moderators: [{ type: Schema.Types.ObjectId, ref: "User" }],
	date: { type: Date, default: Date.now },
});

module.exports = Topic = mongoose.model("Topic", topicSchema);
