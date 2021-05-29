import express from "express";
import { DI } from "../app";

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
// @access  Public

router.get("/", async (req, res) => {
	try {
		const posts = await DI.postRepo.findAll({ limit: 10, offset: parseInt(req.query.skip as string) })
		if (!posts) throw Error("Could not fetch posts");
		res.status(200).json({
			posts,
			nextCursor: posts.length
				? parseInt(req.query.skip as string) + posts.length
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
		const posts = await DI.postRepo.find({ topic: parseInt(req.params.topic as string) })
		if (!posts) throw Error("No posts found");
		res.status(200).json({
			posts,
			nextCursor: posts.length
				? parseInt(req.query.skip as string) + posts.length
				: undefined,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

export const PostsRouter = router;
