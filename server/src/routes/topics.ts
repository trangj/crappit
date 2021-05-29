import express from "express";
import { DI } from '../app'

const router = express.Router();

// @route   GET /api/topics
// @desc    Get all topics
// @access  Public

router.get("/", async (req, res) => {
	try {
		const topics = await DI.topicRepo.findAll();
		if (!topics) throw Error("Could not get topics");
		res.status(200).json(topics);
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

export const TopicsRouter = router;
