// express setup
const express = require("express");
const router = express.Router();
// middleware
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");
// schemas
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const Topic = require("../models/Topic");

// @route   GET /api/index
// @desc    Get all posts
// @access  Public

router.get("/", async (req, res) => {
	try {
		const posts = await Post.find().skip(parseInt(req.query.skip)).limit(10);
		if (!posts) throw Error("Could not fetch posts");
		res.status(200).json(posts);
	} catch (err) {
		res.status(400).json({ status: err.message });
	}
});

// @route   GET /api/index/t/:topic/p/:id
// @desc    Get a post
// @access  Public

router.get("/t/:topic/p/:id", async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id }).populate({
			path: "comments",
		});
		if (!post) throw Error("Could not fetch post");
		res.status(200).json({ post });
	} catch (err) {
		res.status(400).json({ status: err.message });
	}
});

// @route   POST /api/index/t/:topic/p
// @desc    Create post
// @access  Private

router.post("/t/:topic/p", auth, upload.single("file"), async (req, res) => {
	const newPost = new Post({
		title: req.body.title,
		author: req.user.username,
		authorId: req.user.id,
		content: req.body.content,
		link: req.body.link,
		type: req.body.type,
		topic: req.params.topic,
		imageURL: req.file ? req.file.location : "",
		imageName: req.file ? req.file.key : "",
	});
	try {
		const topic = await Topic.findOne({ title: req.params.topic });
		if (!topic) throw Error("No topic exists");
		const post = await newPost.save();
		if (!post) throw Error("Post could not be made");
		topic.posts.push(newPost);
		await topic.save();
		res.status(200).json({
			status: { text: "Post successfully created", severity: "success" },
			post,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   DELETE /api/index/t/:topic/p/:id
// @desc    Delete a post
// @access  Private

router.delete("/t/:topic/p/:id", auth, async (req, res) => {
	try {
		const query = await Post.deleteOne({
			_id: req.params.id,
			authorId: req.user.id,
		});
		if (!query.deletedCount)
			throw Error("Post does not exist or you are not the author");
		await Comment.deleteMany({ post: req.params.id });
		await Topic.updateOne(
			{ title: req.params.topic },
			{ $pull: { posts: req.params.id } }
		);
		res.status(200).json({
			status: { text: "Post successfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/index/t/:topic/p/:id
// @desc    Update a post
// @access  Private

router.put("/t/:topic/p/:id", auth, async (req, res) => {
	try {
		if (!req.body.content) throw Error("Missing required fields");
		const post = await Post.findOneAndUpdate(
			{ _id: req.params.id, authorId: req.user.id },
			{ $set: { content: req.body.content } },
			{ useFindAndModify: false, new: true }
		).populate("comments");
		if (!post)
			throw Error("Post does not exist or you are not the author of the post");
		if (post.type !== "text") throw Error("You can only edit text posts");
		res.status(200).json({
			post,
			status: { text: "Post successfully updated", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/index/t/:topic/p/:id/changevote
// @desc    Change vote on post
// @access  Private

router.put("/t/:topic/p/:id/changevote", auth, async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id });
		if (!post) throw Error("No post exists");
		const user = await User.findOne({ _id: req.user.id });
		if (!user) throw Error("No user exists");

		if (req.query.vote == "like") {
			if (post.likes.includes(req.user.id)) {
				post.likes.pull(req.user.id);
			} else if (post.dislikes.includes(req.user.id)) {
				post.dislikes.pull(req.user.id);
				post.likes.push(req.user.id);
			} else {
				post.likes.push(req.user.id);
			}
			await post.save();
			res.status(200).json({ post });
		} else if (req.query.vote == "dislike") {
			if (post.dislikes.includes(req.user.id)) {
				post.dislikes.pull(req.user.id);
			} else if (post.likes.includes(req.user.id)) {
				post.likes.pull(req.user.id);
				post.dislikes.push(req.user.id);
			} else {
				post.dislikes.push(req.user.id);
			}
			await post.save();
			res.status(200).json({ post });
		}
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

module.exports = router;
