import express from "express";
import { optionalAuth } from "../middleware/auth";
import { Topic } from '../entities';

const router = express.Router();

// @route   GET /api/topics
// @desc    Get all topics
// @access  Public

router.get("/", async (req, res) => {
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

// @route   GET /api/topics/followed_topics
// @desc    Get user's followed topics
// @access  Public

router.get("/followed_topics", optionalAuth, async (req, res) => {
	try {
		const topics_followed = await Topic.query(`
			select
			t.title title,
			t.icon_image_url icon_image_url,
			t.icon_image_name icon_image_name
			from follow ft
			left join topic t on ft.topic_id = t.id
			where ft.user_id = $1
		`, [req.user.id]);
		res.status(200).json({ topics_followed });
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

export const TopicsRouter = router;
