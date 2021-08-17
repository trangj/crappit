import express from "express";
import { auth, optionalAuth } from "../middleware/auth";
import { Topic, User } from '../entities';
import { deleteFile, upload } from "../middleware/upload";

const router = express.Router();

// @route   GET /api/topic
// @desc    Get a topic
// @access  Public

router.get("/:topic", optionalAuth, async (req, res) => {
	try {
		const topic = await Topic.query(`
			select
			t.*,
			f.user_id user_followed_id,
			m.user_id user_moderator_id
			from topic t
			left join follow f on f.topic_id = t.id and f.user_id = $1
			left join moderator m on m.topic_id = t.id and m.user_id = $2
			where t.title = $3
		`, [req.user.id, req.user.id, req.params.topic]);
		if (!topic[0]) throw Error("Topic does not exist");

		const moderators = await User.query(`
			select
			m.*,
			u.username
			from moderator m
			left join "user" u on u.id = m.user_id
			where m.topic_id = $1
		`, [topic[0].id]);

		res.status(200).json({
			topic: { ...topic[0], moderators },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   POST /api/topic
// @desc    Create a topic
// @access  Private

router.post("/", auth, upload, async (req, res) => {
	try {
		const user = await User.findOne(req.user.id);
		if (!user) throw Error("No user was found with that id");

		const newTopic = await Topic.create({
			title: req.body.title,
			description: req.body.description,
			image_url: req.file ? req.file.location : "",
			image_name: req.file ? req.file.key : "",
			moderators: [user],
			followers: [user]
		}).save().catch(err => { throw Error('A topic with that title already exists'); });

		res.status(200).json({
			topic: { title: newTopic.title },
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
		const user = await User.findOne(req.user.id, { relations: ['topics_followed'] });
		if (!user) throw Error("No user was found with that id");

		const topic = await Topic.findOne({ title: req.params.topic });
		if (!topic) throw Error('No topic exists');

		let message;
		let follow;

		if (user.topics_followed.some(curTopic => curTopic.id === topic.id)) {
			user.topics_followed = user.topics_followed.filter(curTopic => curTopic.id !== topic.id);
			topic.number_of_followers -= 1;
			message = "Successfully unfollowed";
			follow = null;
		} else {
			user.topics_followed.push(topic);
			topic.number_of_followers += 1;
			message = "Successfully followed";
			follow = user.id;
		}

		await user.save();
		await topic.save();

		res.status(200).json({
			topic: topic.title,
			user_followed_id: follow,
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
		const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
		if (!topic) throw Error("Could not update topic");

		const user = await User.findOne(req.user.id);
		if (!topic.moderators.some(moderator => moderator.id === user.id)) throw Error("You are not a moderator");

		topic.description = req.body.description;
		topic.headline = req.body.headline;

		await topic.save();

		res.status(200).json({
			topic: { description: topic.description, headline: topic.headline },
			status: { text: "Successfully updated topic", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   POST /api/topic/:topic/icon
// @desc    Change topic icon
// @access  Private

router.post('/:topic/icon', auth, upload, async (req, res) => {
	try {
		const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
		if (!topic) throw Error("Could not update topic");

		const user = await User.findOne(req.user.id);
		if (!topic.moderators.some(moderator => moderator.id === user.id)) throw Error("You are not a moderator");

		if (topic.icon_image_name && req.file) {
			// if topic already has banner and a photo has been uploaded
			deleteFile(topic.icon_image_name);
			topic.icon_image_url = req.file.location;
			topic.icon_image_name = req.file.key;
		} else if (req.file) {
			// if topic doesnt have a banner and a photo has been uploaded
			topic.icon_image_url = req.file.location;
			topic.icon_image_name = req.file.key;
		}

		await topic.save();

		res.status(200).json({
			topic: { icon_image_url: topic.icon_image_url, icon_image_name: topic.icon_image_name },
			status: { text: "Successfully updated icon", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   POST /api/topic/:topic/icon
// @desc    Change topic icon
// @access  Private

router.post('/:topic/banner', auth, upload, async (req, res) => {
	try {
		const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
		if (!topic) throw Error("Could not update topic");

		const user = await User.findOne(req.user.id);
		if (!topic.moderators.some(moderator => moderator.id === user.id)) throw Error("You are not a moderator");

		if (topic.image_name && req.file) {
			// if topic already has banner and a photo has been uploaded
			deleteFile(topic.image_name);
			topic.image_url = req.file.location;
			topic.image_name = req.file.key;
		} else if (req.file) {
			// if topic doesnt have a banner and a photo has been uploaded
			topic.image_url = req.file.location;
			topic.image_name = req.file.key;
		}

		await topic.save();

		res.status(200).json({
			topic: { image_url: topic.image_url, image_name: topic.image_name, },
			status: { text: "Successfully updated banner", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

export const TopicRouter = router;
