import express from "express";
import auth from "../middleware/auth";
import { DI } from '../app'

const router = express.Router();

// @route   GET /api/topic
// @desc    Get a topic
// @access  Public

router.get("/:topic", async (req, res) => {
	try {
		const topic = await DI.topicRepo.findOne({ title: req.params.topic }, ['followers'])
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
		const topic = await DI.topicRepo.findOne({ title: req.body.title });
		if (topic) throw Error("Topic already exists");
		const newTopic = DI.topicRepo.create({
			title: req.body.title,
			description: req.body.description,
		});
		const user = DI.userRepo.getReference(req.user.id)
		newTopic.followers.add(user)
		newTopic.moderators.add(user)
		await DI.topicRepo.persistAndFlush(newTopic);

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
		const user = await DI.userRepo.findOne(req.user.id, ['topicsFollowed']);
		const topic = await DI.topicRepo.findOne({ title: req.params.topic })
		let message;

		if (user.topicsFollowed.contains(topic)) {
			user.topicsFollowed.remove(topic)
			message = "Successfully unfollowed"
		} else {
			user.topicsFollowed.add(topic)
			message = "Successfully followed"
		}
		await DI.userRepo.flush()
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
		const topic = await DI.topicRepo.findOne({ title: req.params.topic }, ['moderators']);
		if (!topic) throw Error("Could not update topic");

		const user = DI.userRepo.getReference(req.user.id)
		if (!topic.moderators.contains(user)) throw Error("You are not a moderator")

		topic.description = req.body.description
		DI.topicRepo.flush()

		res.status(200).json({
			topic,
			status: { text: "Successfully updated topic", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

export const TopicRouter = router;
