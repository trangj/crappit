const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
	title: { type: String, required: true },
	author: { type: String, required: true },
	authorId: { type: Schema.Types.ObjectId, required: true },
	type: { type: String, required: true },
	topic: { type: String, required: true },
	content: String,
	link: String,
	imageURL: String,
	imageName: String,
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	numberOfComments: { type: Number, default: 0 },
	vote: { type: Number, default: 0 },
	date: {
		type: Date,
		default: Date.now,
	},
	lastEditDate: {
		type: Date,
	},
});

module.exports = Post = mongoose.model("Post", postSchema);
