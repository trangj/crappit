const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	authorId: { type: Schema.Types.ObjectId, required: true },
	content: String,
	link: String,
	type: { type: String, required: true },
	topic: { type: String, required: true },
	imageURL: String,
	imageName: String,
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = Post = mongoose.model("Post", postSchema);
