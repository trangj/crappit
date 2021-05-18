const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username: {
		type: String,
		required: true,
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
	register_date: {
		type: Date,
		default: Date.now,
	},
	resetPasswordToken: String,
	resetPasswordExpires: Date,
});

module.exports = User = mongoose.model("User", userSchema);
