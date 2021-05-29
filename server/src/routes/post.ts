import express from "express";
import { upload, deleteFile } from "../middleware/upload";
import auth from "../middleware/auth";
import { DI } from "../app";

const router = express.Router();

// @route   GET /api/post/:id
// @desc    Get a post
// @access  Public

router.get("/:id", async (req, res) => {
	try {
		const post = await DI.postRepo.findOne(parseInt(req.params.id));
		if (!post) throw Error("Could not fetch post");
		res.status(200).json({ post });
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

// @route   POST /api/post
// @desc    Create post
// @access  Private

router.post("/", auth, upload.single("file"), async (req, res) => {
	try {
		const topic = DI.topicRepo.getReference(req.body.topic);
		if (!topic) throw Error("No topic exists");

		const user = DI.userRepo.getReference(req.user.id)
		if (!user) throw Error("No user exists");

		const newPost = DI.postRepo.create({
			title: req.body.title,
			type: req.body.type,
			content: req.body.content,
			imageURL: req.file ? req.file.location : "",
			imageName: req.file ? req.file.key : "",
			author: user,
			topic: topic,
		});
		console.log(newPost)
		// DI.postRepo.persistAndFlush(newPost)
		res.status(200).json({
			status: { text: "Post successfully created", severity: "success" },
			newPost,
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   DELETE /api/post/:id
// @desc    Delete a post
// @access  Private

router.delete("/:id", auth, async (req, res) => {
	try {
		const post = await DI.postRepo.findOne(parseInt(req.params.id))
		if (!post) throw Error("Post does not exist or you are not the author");
		// await DI.postRepo.removeAndFlush(post);
		if (post.type === "photo") deleteFile(post.imageName);
		res.status(200).json({
			status: { text: "Post successfully deleted", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/post/:id
// @desc    Update a post
// @access  Private

router.put("/:id", auth, async (req, res) => {
	try {
		const user = DI.userRepo.getReference(req.user.id)

		if (!req.body.content) throw Error("Missing required fields");
		const post = await DI.postRepo.findOne({ id: parseInt(req.params.id), author: user });
		if (!post)
			throw Error("Post does not exist or you are not the author of the post");
		if (post.type !== "text") throw Error("You can only edit text posts");

		post.content = req.body.content

		DI.postRepo.flush()

		res.status(200).json({
			post,
			status: { text: "Post successfully updated", severity: "success" },
		});
	} catch (err) {
		res.status(400).json({ status: { text: err.message, severity: "error" } });
	}
});

// @route   PUT /api/post/:id/changevote
// @desc    Change vote on post
// @access  Private

router.put("/:id/changevote", auth, async (req, res) => {
	try {
		const post = await Post.findOne({ _id: req.params.id });
		if (!post) throw Error("No post exists");
		const user = await User.findOne({ _id: req.user.id });
		if (!user) throw Error("No user exists");

		if (req.query.vote == "like") {
			if (user.likedPosts.includes(post._id)) {
				user.likedPosts.pull(post._id);
				post.vote -= 1;
			} else if (user.dislikedPosts.includes(post._id)) {
				user.dislikedPosts.pull(post._id);
				user.likedPosts.push(post._id);
				post.vote += 2;
			} else {
				user.likedPosts.push(post._id);
				post.vote += 1;
			}
			await user.save();
			await post.save();
			res.status(200).json({ post, user });
		} else if (req.query.vote == "dislike") {
			if (user.dislikedPosts.includes(post._id)) {
				user.dislikedPosts.pull(post._id);
				post.vote += 1;
			} else if (user.likedPosts.includes(post._id)) {
				user.likedPosts.pull(post._id);
				user.dislikedPosts.push(post._id);
				post.vote -= 2;
			} else {
				user.dislikedPosts.push(post._id);
				post.vote -= 1;
			}
			await user.save();
			await post.save();
			res.status(200).json({ post, user });
		}
	} catch (err) {
		res.status(400).json({
			status: { text: err.message, severity: "error" },
		});
	}
});

export const PostRouter = router;
