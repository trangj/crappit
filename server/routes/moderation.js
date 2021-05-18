// express setup
const express = require("express");
const router = express.Router();
// middleware
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
// schemas
const Topic = require("../models/Topic");
const User = require("../models/User");

// @route   POST /api/moderation/:topic
// @desc    Add a moderator to a topic
// @access  Public

router.post("/:topic", auth, async (req, res) => {
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
		topic.moderators.push(user);
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

module.exports = router;
