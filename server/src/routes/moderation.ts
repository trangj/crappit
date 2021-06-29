import express from "express";
import { deleteFile } from "../middleware/upload";
import { auth } from "../middleware/auth";
import { User, Topic, Post, Comment } from "../entities";

const router = express.Router();

// @route   POST /api/moderation/topic/:topic
// @desc    Add a moderator to a topic
// @access  Private

router.post("/topic/:topic", auth, async (req, res) => {
	try {
		const user = await User.findOne({ username: req.body.username }, { relations: ['topics_moderated'] });
		if (!user) throw Error("User does not exist");
		const topic = await Topic.findOne({ title: req.params.topic }, { relations: ['moderators'] });
		if (!topic) throw Error("Topic does not exist");
		if (!topic.moderators.some(moderator => moderator.id === req.user.id)) throw Error("You are not a moderator");

		user.topics_moderated.push(topic);
		await user.save();
		res.status(200).json({
			status: { text: "Moderator successfully added", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   DELETE /api/moderation/post/:post
// @desc    Delete a post
// @access  Private

router.delete("/post/:post", auth, async (req, res) => {
	try {
		const post = await Post.findOne(req.params.post, { relations: ['topic'] });
		if (!post) throw Error("Post does not exist");
		const topic = await Topic.findOne({ title: post.topic.title }, { relations: ['moderators'] });
		if (!topic) throw Error("Topic does not exist");
		if (!topic.moderators.some(moderator => moderator.id === req.user.id)) throw Error("You are not a moderator");
		await Post.remove(post);
		if (post.type === "photo") deleteFile(post.image_name);
		res.status(200).json({
			status: { text: "Post successfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// // @route   DELETE /api/moderation/comment/:commentid
// // @desc    Delete a comment
// // @access  Private

router.delete("/comment/:commentid", auth, async (req, res) => {
	try {
		const comment = await Comment.findOne(req.params.commentid, { relations: ['post', 'post.topic'] });
		if (!comment) throw Error("Comment does not exist");
		const topic = await Topic.findOne({ title: comment.post.topic.title }, { relations: ['moderators'] });
		if (!topic) throw Error("Topic does not exist");
		if (!topic.moderators.some(moderator => moderator.id === req.user.id)) throw Error("You are not a moderator");

		comment.content = null;
		comment.author = null;
		comment.is_deleted = true;

		await comment.save();

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

export const ModerationRouter = router;
