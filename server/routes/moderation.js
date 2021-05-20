// express setup
const express = require("express");
const router = express.Router();
// middleware
const { deleteFile } = require("../middleware/upload");
const auth = require("../middleware/auth");
// schemas
const Topic = require("../models/Topic");
const User = require("../models/User");

// @route   POST /api/moderation/topic/:topic
// @desc    Add a moderator to a topic
// @access  Private

router.post("/topic/:topic", auth, async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username });
		if (!user) throw Error("User does not exist");
		const topic = await Topic.findOne({ title: req.params.topic }).populate({
			path: "moderators",
			select: "username",
		});
		if (!topic) throw Error("Topic does not exist");
		if (
			!!topic.moderators.filter(
				(moderator) => moderator.username === user.username
			).length
		)
			throw Error("User is already a moderator");
		user.topicsModerating.push(topic.title);
		topic.moderators.push(user);
		await user.save();
		await topic.save();
		res.status(200).json({
			topic,
			status: { text: "Moderator successfully added", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   DELETE /api/moderation/post/:post
// @desc    Delete a post
// @access  Private

router.delete("/post/:post", auth, async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.post });
		if (!post) throw Error("Post does not exist");
		const topic = await Topic.findOne({ title: post.topic }).populate({
			path: "moderators",
			select: "username",
		});
		if (!topic) throw Error("Topic does not exist");
		if (
			!!!topic.moderators.filter(
				(moderator) => moderator.username === req.user.username
			).length
		)
			throw Error("You are not a moderator for this topic");

		const query = await Post.deleteOne({
			_id: req.params.post,
		});
		if (!query.deletedCount)
			throw Error("Post does not exist or you are not the author");

		if (post.type === "photo") deleteFile(post.imageName);

		await Comment.deleteMany({ postId: req.params.post });

		res.status(200).json({
			status: { text: "Post successfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

module.exports = router;
