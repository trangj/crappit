const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	author: { type: String, required: true },
	authorId: { type: Schema.Types.ObjectId, required: true },
	content: { type: String, required: true },
	topic: { type: String, required: true },
	comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
	postId: { type: Schema.Types.ObjectId, ref: "Post" },
	date: { type: Date, default: Date.now },
	lastEditDate: {
		type: Date,
	},
});

function populateComments(next) {
	this.populate({ path: "comments", options: { sort: { date: -1 } } });
	next();
}

commentSchema.pre("find", populateComments);

module.exports = Comment = mongoose.model("Comment", commentSchema);
