// express setup
const express = require("express");
const router = express.Router();
// middleware
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
// schemas
const Post = require("../models/Post");
const Topic = require("../models/Topic");

// @route   GET /api/index/t
// @desc    Get all topics
// @access  Public

router.get("/t", async (req, res) => {
	try {
		const topics = await Topic.find();
		if (!topics) throw Error("Could not get topics");
		res.status(200).json(topics);
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   GET /api/index/t/:topic
// @desc    Get a topic
// @access  Public

router.get("/t/:topic", async (req, res) => {
	try {
		const posts = await Post.find({ topic: req.params.topic })
			.skip(parseInt(req.query.skip))
			.limit(10);
		if (!posts) throw Error("No posts found");
		res.status(200).json({
			posts,
			nextCursor: posts.length
				? parseInt(req.query.skip) + posts.length
				: undefined,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   GET /api/index/t/:topic/info
// @desc    Get a topic's info
// @access  Public

router.get("/t/:topic/info", async (req, res) => {
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

// @route   POST /api/index/t
// @desc    Create a topic
// @access  Private

router.post("/t", auth, upload.single("file"), async (req, res) => {
	const newTopic = new Topic({
		title: req.body.title,
		description: req.body.description,
		imageURL: req.file ? req.file.location : "",
		imageName: req.file ? req.file.key : "",
		moderators: [req.user.id],
	});
	try {
		let topic = await Topic.findOne({ title: req.body.title });
		if (topic) throw Error("Topic already exists");
		topic = await newTopic.save();

		const user = await User.findOne({ _id: req.user.id }).select("-password");
		user.followedTopics.push(topic.title);
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

// @route   POST /api/index/t/:topic/followtopic
// @desc    Follow a topic
// @access  Private

router.post("/t/:topic/followtopic", auth, async (req, res) => {
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

// @route   PUT /api/index/t/:topic
// @desc    Update a topic
// @access  Private

router.put("/t/:topic", auth, upload.single("file"), async (req, res) => {
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
