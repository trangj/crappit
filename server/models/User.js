const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	followedTopics: [String],
	topicsModerating: [String],
	likedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	dislikedComments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
	likedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
	dislikedPosts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
	register_date: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

module.exports = User = mongoose.model("User", userSchema);
