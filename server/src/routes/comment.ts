import express from "express";
import auth from "../middleware/auth";
import { Post, User, Comment } from "../entities";

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
		const newComment = Comment.create({
			author: user,
			content: req.body.content,
			post: post,
		});

		await newComment.save()

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
		const comment = await Comment.findOne(
			{ id: parseInt(req.params.commentid), author: user });
		if (!comment) throw Error("No comment exists or you are not the author");

		comment.content = req.body.content

		await comment.save()

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

// @route   DELETE /api/comment/:commentid
// @desc    Delete a comment
// @access  Private

router.delete("/:commentid", auth, async (req, res) => {
	try {
		const user = await User.findOne(req.user.id)
		const comment = await Comment.findOne(
			{ id: parseInt(req.params.commentid), author: user });
		if (!comment) throw Error("No comment exists or you are not the author");

		comment.content = null
		comment.author = null

		await comment.save()

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

// @route   PUT /api/comment/:commentid/changevote
// @desc    Change vote on comment
// @access  Private

// router.put("/:commentid/changevote", auth, async (req, res) => {
// 	try {
// 		const comment = await Comment.findOne({ _id: req.params.commentid });
// 		if (!comment) throw Error("No comment exists");
// 		const user = await User.findOne({ _id: req.user.id });
// 		if (!user) throw Error("No user exists");

// 		if (req.query.vote == "like") {
// 			if (user.likedComments.includes(comment._id)) {
// 				user.likedComments.pull(comment._id);
// 				comment.vote -= 1;
// 			} else if (user.dislikedComments.includes(comment._id)) {
// 				user.dislikedComments.pull(comment._id);
// 				user.likedComments.push(comment._id);
// 				comment.vote += 2;
// 			} else {
// 				user.likedComments.push(comment._id);
// 				comment.vote += 1;
// 			}
// 			await user.save();
// 			await comment.save();
// 			res.status(200).json({ comment, user });
// 		} else if (req.query.vote == "dislike") {
// 			if (user.dislikedComments.includes(comment._id)) {
// 				user.dislikedComments.pull(comment._id);
// 				comment.vote += 1;
// 			} else if (user.likedComments.includes(comment._id)) {
// 				user.likedComments.pull(comment._id);
// 				user.dislikedComments.push(comment._id);
// 				comment.vote -= 2;
// 			} else {
// 				user.dislikedComments.push(comment._id);
// 				comment.vote -= 1;
// 			}
// 			await user.save();
// 			await comment.save();
// 			res.status(200).json({ comment, user });
// 		}
// 	} catch (err) {
// 		res.status(400).json({
// 			status: { text: err.message, severity: "error" },
// 		});
// 	}
// });

// @route   POST /api/comment/:commentid/reply
// @desc    Add a reply to a comment
// @access  Private

router.post("/:commentid/reply", auth, async (req, res) => {
	try {
		const comment = await Comment.findOne(parseInt(req.params.commentid));
		if (!comment) throw Error("No comment");
		const user = await User.findOne(req.user.id)
		const newComment = Comment.create({
			author: user,
			content: req.body.content,
			post: null,
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
