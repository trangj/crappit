// express setup
const express = require("express");
const router = express.Router();
// middleware
const { upload } = require("../middleware/upload");
const auth = require("../middleware/auth");
// schemas
const Topic = require("../models/Topic");

// @route   GET /api/topic
// @desc    Get a topic
// @access  Public

router.get("/:topic", async (req, res) => {
	try {
		const topic = await Topic.findOne({ title: req.params.topic }).populate({
			path: "moderators",
			select: "username",
		});
		if (!topic) throw Error("Topic does not exist");
		res.status(200).json({
			topic,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   POST /api/topic
// @desc    Create a topic
// @access  Private

router.post("/", auth, upload.single("file"), async (req, res) => {
	try {
		let topic = await Topic.findOne({ title: req.body.title });
		if (topic) throw Error("Topic already exists");
		const newTopic = new Topic({
			title: req.body.title,
			description: req.body.description,
			imageURL: req.file ? req.file.location : "",
			imageName: req.file ? req.file.key : "",
			moderators: [req.user.id],
		});
		topic = await newTopic.save();
		const user = await User.findOne({ _id: req.user.id }).select("-password");
		user.followedTopics.push(topic.title);
		user.topicsModerating.push(topic.title);
		await user.save();

		res.status(200).json({
			user,
			topic,
			status: { text: "Topic successfully created", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   POST /api/topic/:topic/followtopic
// @desc    Follow a topic
// @access  Private

router.post("/:topic/followtopic", auth, async (req, res) => {
	try {
		const user = await User.findOne({ _id: req.user.id }).select("-password");
		if (!user) throw Error("No user exists");

		if (user.followedTopics.includes(req.params.topic)) {
			user.followedTopics = user.followedTopics.filter(
				(topic) => topic !== req.params.topic
			);
			await user.save();
			res.status(200).json({
				user,
				status: { text: "Successfully unfollowed", severity: "success" },
			});
		} else {
			user.followedTopics.push(req.params.topic);
			await user.save();
			res.status(200).json({
				user,
				status: { text: "Successfully followed", severity: "success" },
			});
		}
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/topic/:topic
// @desc    Update a topic
// @access  Private

router.put("/:topic", auth, upload.single("file"), async (req, res) => {
	try {
		const topic = await Topic.findOneAndUpdate(
			{ title: req.params.topic, moderators: [req.user.id] },
			{
				$set: {
					description: req.body.description,
					...(req.file && { imageURL: req.file.location }),
					...(req.file && { imageName: req.file.key }),
				},
			},
			{ useFindAndModify: false, new: true }
		);
		if (!topic) throw Error("Could not update topic");
		res.status(200).json({
			topic,
			status: { text: "Successfully updated topic", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

module.exports = router;
