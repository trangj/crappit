import express from "express";
import { auth, optionalAuth } from "../middleware/auth";
import { Topic, User } from '../entities';
import { upload } from "../middleware/upload";

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

		if (req.body.title.length > 21 || req.body.title < 3) throw Error("Topic title is too long or too short")
		if (req.body.description.length > 500) throw Error("Topic description is too long")

		const newTopic = await Topic.create({
			title: req.body.title,
			description: req.body.description,
			image_url: req.file ? req.file.location : "",
			image_name: req.file ? req.file.key : "",
			moderators: [user],
			followers: [user],
			number_of_followers: 1
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

export const TopicRouter = router;
