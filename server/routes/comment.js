// express setup
const express = require("express");
const router = express.Router();
// middleware
const auth = require("../middleware/auth");
// schemas
const Post = require("../models/Post");
const Comment = require("../models/Comment");

// @route   POST /api/index/t/:topic/p/:id
// @desc    Create a comment
// @access  Private

router.post("/t/:topic/p/:id", auth, async (req, res) => {
	const newComment = new Comment({
		author: req.user.username,
		authorId: req.user.id,
		content: req.body.content,
		topic: req.params.topic,
		post: req.params.id,
	});
	try {
		const comment = await newComment.save();
		if (!comment) throw Error("No comment");
		const post = await Post.findOne({ _id: req.params.id });
		if (!post) throw Error("No post");

		post.comments.push(newComment);
		await post.save();
		res.status(200).json({
			comment,
			status: { text: "Comment succesfully added", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/index/t/:topic/p/:id/c/:commentid
// @desc    Update a comment
// @access  Private

router.put("/t/:topic/p/:id/c/:commentid", auth, async (req, res) => {
	try {
		if (!req.body.content) throw Error("Missing required fields");
		const comment = await Comment.findOneAndUpdate(
			{ _id: req.params.commentid, authorId: req.user.id },
			{ $set: { content: req.body.content } },
			{ useFindAndModify: false, new: true }
		);
		if (!comment) throw Error("No comment exists or you are not the author");
		res.status(200).json({
			status: { text: "Comment successfully updated", severity: "success" },
			comment,
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   GET /api/index/t/:topic/p/:id/c/:commentid
// @desc    Delete a comment
// @access  Private

router.delete("/t/:topic/p/:id/c/:commentid", auth, async (req, res) => {
	try {
		const comment = await Comment.findOneAndUpdate(
			{
				_id: req.params.commentid,
				authorId: req.user.id,
			},
			{
				$set: {
					author: "[deleted]",
					authorId: null,
					content: "[deleted]",
				},
			},
			{ useFindAndModify: false, new: true }
		);
		if (!comment)
			throw Error("Comment does not exist or you are not the author");
		res.status(200).json({
			comment,
			status: { text: "Comment succesfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   PUT /api/index/t/:topic/p/:id/c/:commentid/changevote
// @desc    Change vote on comment
// @access  Private

router.put(
	"/t/:topic/p/:id/c/:commentid/changevote",
	auth,
	async (req, res) => {
		try {
			const comment = await Comment.findOne({ _id: req.params.commentid });
			if (!comment) throw Error("No comment exists");
			const user = await User.findOne({ _id: req.user.id });
			if (!user) throw Error("No user exists");

			if (req.query.vote == "like") {
				if (comment.likes.includes(req.user.id)) {
					comment.likes.pull(req.user.id);
				} else if (comment.dislikes.includes(req.user.id)) {
					comment.dislikes.pull(req.user.id);
					comment.likes.push(req.user.id);
				} else {
					comment.likes.push(req.user.id);
				}
				await comment.save();
				res.status(200).json({ comment });
			} else if (req.query.vote == "dislike") {
				if (comment.dislikes.includes(req.user.id)) {
					comment.dislikes.pull(req.user.id);
				} else if (comment.likes.includes(req.user.id)) {
					comment.likes.pull(req.user.id);
					comment.dislikes.push(req.user.id);
				} else {
					comment.dislikes.push(req.user.id);
				}
				await comment.save();
				res.status(200).json({ comment });
			}
		} catch (err) {
			res.status(400).json({
				status: { text: err.message, severity: "error" },
			});
		}
	}
);

// @route   POST /api/index/t/:topic/p/:id/c/:commentid/reply
// @desc    Add a reply to a comment
// @access  Private

router.post("/t/:topic/p/:id/c/:commentid/reply", auth, async (req, res) => {
	const newComment = new Comment({
		author: req.user.username,
		authorId: req.user.id,
		content: req.body.content,
		topic: req.params.topic,
		post: req.params.id,
		comment: req.params.commentid,
	});
	try {
		const reply = await newComment.save();
		if (!reply) throw Error("No reply");
		const comment = await Comment.findOne({ _id: req.params.commentid });
		if (!comment) throw Error("No comment");

		comment.comments.push(reply);
		await comment.save();

		res.status(200).json({
			reply,
			status: { text: "reply made successfully", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

module.exports = router;
