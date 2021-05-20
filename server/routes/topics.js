// express setup
const express = require("express");
const router = express.Router();
// schemas
const Topic = require("../models/Topic");

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

module.exports = router;
