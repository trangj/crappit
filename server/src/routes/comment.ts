import express from "express";
import { auth } from "../middleware/auth";
import { Post, User, Comment, CommentVote } from "../entities";

const router = express.Router();

// @route   POST /api/comment
// @desc    Create a comment
// @access  Private

router.post("/", auth, async (req, res) => {
	try {
		const post = await Post.findOne(req.body.postId);
		if (!post) throw Error("No post");
		const user = await User.findOne(req.user.id)
		if (!user) throw Error("No user");

		const newComment = await Comment.create({
			author: user,
			content: req.body.content,
			post: post,
		}).save();

		res.status(200).json({
			newComment,
			status: { text: "Comment succesfully added", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/comment/:commentid
// @desc    Update a comment
// @access  Private

router.put("/:commentid", auth, async (req, res) => {
	try {
		if (!req.body.content) throw Error("Missing required fields");
		const user = await User.findOne(req.user.id)
		if (!user) throw Error("No user with that id was found")
		const comment = await Comment.findOne({ id: parseInt(req.params.commentid), author: user });
		if (!comment) throw Error("No comment exists or you are not the author");

		comment.content = req.body.content

		await comment.save()

		res.status(200).json({
			comment: { content: comment.content },
			status: { text: "Comment successfully updated", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   DELETE /api/comment/:commentid
// @desc    Delete a comment
// @access  Private

router.delete("/:commentid", auth, async (req, res) => {
	try {
		const user = await User.findOne(req.user.id)
		if (!user) throw Error("No user with that id was found")
		const comment = await Comment.findOne({ id: parseInt(req.params.commentid), author: user });
		if (!comment) throw Error("No comment exists or you are not the author");

		comment.content = null
		comment.author = null

		await comment.save()

		res.status(200).json({
			status: { text: "Comment succesfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   PUT /api/comment/:commentid/changevote
// @desc    Change vote on comment
// @access  Private

router.put("/:commentid/changevote", auth, async (req, res) => {
	try {
		const comment = await Comment.findOne(req.params.commentid);
		if (!comment) throw Error("No comment exists");
		const user = await User.findOne(req.user.id);
		if (!user) throw Error("No user exists");

		const vote = await CommentVote.findOne({ where: { comment, user } })
		let newVote

		if (!vote) {
			newVote = await CommentVote.create({
				comment,
				user,
				value: req.query.vote === "like" ? 1 : -1
			}).save()
			res.status(200).json({ value: newVote.value })
		} else {
			if (req.query.vote === "like") {
				if (vote.value === 1) {
					vote.value = 0;
					comment.vote -= 1
				} else {
					vote.value = 1;
					comment.vote += 1
				}
			} else {
				if (vote.value === -1) {
					vote.value = 0;
					comment.vote += 1
				} else {
					vote.value = -1;
					comment.vote -= 1
				}
			}
			vote.save()
			comment.save()
			res.status(200).json({ value: vote.value })
		}
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   POST /api/comment/:commentid/reply
// @desc    Add a reply to a comment
// @access  Private

router.post("/:commentid/reply", auth, async (req, res) => {
	try {
		const comment = await Comment.findOne(parseInt(req.params.commentid));
		if (!comment) throw Error("No comment was found with that id")
		const user = await User.findOne(req.user.id)
		if (!user) throw Error("No user was found with that id")
		const post = await Post.findOne(req.body.postId)
		if (!post) throw Error("No post was found with that id")

		const newComment = Comment.create({
			author: user,
			content: req.body.content,
			post: post,
			parent_comment: comment
		});

		await newComment.save()

		res.status(200).json({
			newComment,
			status: { text: "Reply made successfully", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

export const CommentRouter = router;
