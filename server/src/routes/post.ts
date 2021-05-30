import express from "express";
import { upload, deleteFile } from "../middleware/upload";
import auth from "../middleware/auth";
import { Comment, Post, Topic, User } from "../entities";

const router = express.Router();

// @route   GET /api/post/:id
// @desc    Get a post
// @access  Public

router.get("/:id", async (req, res) => {
	try {
		const post = await Post.findOne(parseInt(req.params.id));
		if (!post) throw Error("Post does not exist");

		let comments = await Comment.find({ where: { post }, relations: ['author'] })

		const makeForest = (id: any, xs: Comment[]): any => {
			return xs.filter(({ parentCommentId }) => parentCommentId === id)
				.map(({ id, parentCommentId, ...rest }) => ({ id, ...rest, children: makeForest(id, xs) }))
		}

		res.status(200).json({ post: { ...post, comments: makeForest(null, comments) } });
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
		const topic = await Topic.findOne(req.body.topic);
		if (!topic) throw Error("No topic exists");

		const user = await User.findOne(req.user.id)
		if (!user) throw Error("No user exists");

		const newPost = Post.create({
			title: req.body.title,
			type: req.body.type,
			content: req.body.content,
			imageURL: req.file ? req.file.location : "",
			imageName: req.file ? req.file.key : "",
			author: user,
			topic: topic,
		})

		await newPost.save()

		res.status(200).json({
			newPost,
			status: { text: "Post successfully created", severity: "success" },
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
		const user = await User.findOne(req.user.id)
		const post = await Post.findOne({ where: { id: parseInt(req.params.id), author: user } })
		if (!post) throw Error("Post does not exist or you are not the author");
		await Post.remove(post);
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
		const user = await User.findOne(req.user.id)
		const post = await Post.findOne({ where: { id: parseInt(req.params.id), author: user } });
		if (!post)
			throw Error("Post does not exist or you are not the author of the post");
		if (post.type !== "text") throw Error("You can only edit text posts");

		if (!req.body.content) throw Error("Missing required fields");
		post.content = req.body.content

		await post.save()

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

// router.put("/:id/changevote", auth, async (req, res) => {
// 	try {
// 		const post = await Post.findOne({ _id: req.params.id });
// 		if (!post) throw Error("No post exists");
// 		const user = await User.findOne({ _id: req.user.id });
// 		if (!user) throw Error("No user exists");

// 		if (req.query.vote == "like") {
// 			if (user.likedPosts.includes(post._id)) {
// 				user.likedPosts.pull(post._id);
// 				post.vote -= 1;
// 			} else if (user.dislikedPosts.includes(post._id)) {
// 				user.dislikedPosts.pull(post._id);
// 				user.likedPosts.push(post._id);
// 				post.vote += 2;
// 			} else {
// 				user.likedPosts.push(post._id);
// 				post.vote += 1;
// 			}
// 			await user.save();
// 			await post.save();
// 			res.status(200).json({ post, user });
// 		} else if (req.query.vote == "dislike") {
// 			if (user.dislikedPosts.includes(post._id)) {
// 				user.dislikedPosts.pull(post._id);
// 				post.vote += 1;
// 			} else if (user.likedPosts.includes(post._id)) {
// 				user.likedPosts.pull(post._id);
// 				user.dislikedPosts.push(post._id);
// 				post.vote -= 2;
// 			} else {
// 				user.dislikedPosts.push(post._id);
// 				post.vote -= 1;
// 			}
// 			await user.save();
// 			await post.save();
// 			res.status(200).json({ post, user });
// 		}
// 	} catch (err) {
// 		res.status(400).json({
// 			status: { text: err.message, severity: "error" },
// 		});
// 	}
// });

export const PostRouter = router;
