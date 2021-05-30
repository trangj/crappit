import express from "express";
import auth from "../middleware/auth";
import { Topic, User } from '../entities'

const router = express.Router();

// @route   GET /api/topic
// @desc    Get a topic
// @access  Public

router.get("/:topic", async (req, res) => {
	try {
		const topic = await Topic.findOne(parseInt(req.params.topic), { relations: ['moderators', 'followers'] })
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

router.post("/", auth, async (req, res) => {
	try {
		const user = await User.findOne(req.user.id)
		const newTopic = Topic.create({
			title: req.body.title,
			description: req.body.description,
			imageURL: req.file ? req.file.location : "",
			imageName: req.file ? req.file.key : "",
			moderators: [user],
			followers: [user]
		});

		await newTopic.save();

		res.status(200).json({
			newTopic,
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
		const user = await User.findOne(req.user.id, { relations: ['topicsFollowed'] });
		const topic = await Topic.findOne(parseInt(req.params.topic))
		if (!topic) throw Error('No topic exists')
		let message;

		if (user.topicsFollowed.some(curTopic => curTopic.id === topic.id)) {
			user.topicsFollowed = user.topicsFollowed.filter(curTopic => curTopic.id !== topic.id)
			message = "Successfully unfollowed"
		} else {
			user.topicsFollowed.push(topic)
			message = "Successfully followed"
		}
		await user.save()
		res.status(200).json({
			user,
			status: { text: message, severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/topic/:topic
// @desc    Update a topic
// @access  Private

router.put("/:topic", auth, async (req, res) => {
	try {
		const topic = await Topic.findOne(parseInt(req.params.topic), { relations: ['moderators'] });
		if (!topic) throw Error("Could not update topic");

		const user = await User.findOne(req.user.id)
		if (!topic.moderators.some(moderator => moderator.id === user.id)) throw Error("You are not a moderator")

		topic.description = req.body.description
		if (req.file) {
			topic.imageURL = req.file.location
			topic.imageName = req.file.key
		}

		await topic.save()

		res.status(200).json({
			topic,
			status: { text: "Successfully updated topic", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

export const TopicRouter = router;
