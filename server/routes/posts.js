// express setup
const express = require("express");
const router = express.Router();
// schemas
const Post = require("../models/Post");

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public

router.get("/", async (req, res) => {
	try {
		const posts = await Post.find().skip(parseInt(req.query.skip)).limit(10);
		if (!posts) throw Error("Could not fetch posts");
		res.status(200).json({
			posts,
			nextCursor: posts.length
				? parseInt(req.query.skip) + posts.length
				: undefined,
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   GET /api/posts/:topic
// @desc    Get a topic
// @access  Public

router.get("/:topic", async (req, res) => {
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

module.exports = router;
