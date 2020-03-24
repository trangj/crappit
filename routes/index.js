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
// @acess   Public

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    if (!posts) throw Error("No posts");
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ status: "Could not fetch posts" });
  }
});

// @route   GET /api/index/t/:topic/p/:id
// @desc    Get a post
// @acess   Public

router.get("/t/:topic/p/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).populate({
      path: "comments"
    });
    if (!post) throw Error("No post");
    res.status(200).json({ post });
  } catch (err) {
    res.status(400).json({ status: "Could not fetch post" });
  }
});

// @route   POST /api/index/t/:topic/p
// @desc    Create post
// @acess   Private

router.post("/t/:topic/p", auth, upload.single("file"), async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content,
    topic: req.params.topic,
    imageURL: req.file ? req.file.location : "",
    imageName: req.file ? req.file.key : ""
  });
  try {
    const topic = await Topic.findOne({ title: req.params.topic });
    if (!topic) throw Error("No topic");
    topic.posts.push(newPost);
    await topic.save();
    const post = await newPost.save();
    if (!post) throw Error("No post");
    res.status(200).json({ status: "Post successfully created", post });
  } catch (err) {
    res.status(400).json({ status: "Could not create post" });
  }
});

// @route   DELETE /api/index/t/:topic/p/:id
// @desc    Delete a post
// @acess   Private

router.delete("/t/:topic/p/:id", auth, async (req, res) => {
  try {
    await Topic.updateOne(
      { title: req.params.topic },
      { $pull: { posts: req.params.id } }
    );
    await Comment.deleteMany({ post: req.params.id });
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json({
      id: req.params.id,
      status: "Post successfully deleted"
    });
  } catch (err) {
    res.status(400).json({ status: "Error in deleting post" });
  }
});

// @route   PUT /api/index/t/:topic/p/:id
// @desc    Update a post
// @acess   Private

router.put("/t/:topic/p/:id", auth, async (req, res) => {
  try {
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id },
      { $set: { content: req.body.content, title: req.body.title } },
      { useFindAndModify: false, new: true }
    );
    if (!post) throw Error("No post");
    res.status(200).json({ status: "Post successfully updated", post });
  } catch (err) {
    res.status(400).json({ status: "Could not update post" });
  }
});

// @route   PUT /api/index/t/:topic/p/:id/changevote
// @desc    Change vote on post
// @acess   Private

router.put("/t/:topic/p/:id/changevote", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) throw Error("No post");
    const user = await User.findOne({ _id: req.body.user });
    if (!user) throw Error("No user");

    if (req.query.vote == "like") {
      if (post.likes.includes(user._id)) {
        return res.json({ status: "Already liked." });
      }
      if (post.dislikes.includes(user._id)) {
        post.dislikes.pull(user._id);
      }
      post.likes.push(user._id);
      await post.save();
      res.status(200).json({ post, status: "Successfully liked" });
    } else if (req.query.vote == "dislike") {
      if (post.dislikes.includes(user._id)) {
        return res.json({ status: "Already disliked." });
      }
      if (post.likes.includes(user._id)) {
        post.likes.pull(user._id);
      }
      post.dislikes.push(user._id);
      await post.save();
      res.status(200).json({ post, status: "Successfully disliked" });
    }
  } catch (err) {
    res.status(400).json({ status: "Could not like/dislike post" });
  }
});

// @route   PUT /api/index/t/:topic/p/:id/c/:commentid/changevote
// @desc    Change vote on comment
// @acess   Private

router.put("/t/:topic/p/:id/c/:commentid/changevote", async (req, res) => {
  try {
    const comment = await Comment.findOne({ _id: req.params.commentid });
    if (!comment) throw Error("No comment");
    const user = await User.findOne({ _id: req.body.user });
    if (!user) throw Error("No user");

    if (req.query.vote == "like") {
      if (comment.likes.includes(user._id)) {
        return res.json({ status: "Already liked." });
      }
      if (comment.dislikes.includes(user._id)) {
        comment.dislikes.pull(user._id);
      }
      comment.likes.push(user._id);
      await comment.save();
      res.status(200).json({ comment, status: "Successfully liked" });
    } else if (req.query.vote == "dislike") {
      if (comment.dislikes.includes(user._id)) {
        return res.json({ status: "Already disliked." });
      }
      if (comment.likes.includes(user._id)) {
        comment.likes.pull(user._id);
      }
      comment.dislikes.push(user._id);
      await comment.save();
      res.status(200).json({ comment, status: "Successfully disliked" });
    }
  } catch (err) {
    console.log(err.message);
    res.status(400).json({ status: "Could not like/dislike post" });
  }
});

// @route   POST /api/index/t/:topic/p/:id
// @desc    Create a comment
// @acess   Private

router.post("/t/:topic/p/:id", auth, async (req, res) => {
  const newComment = new Comment({
    author: req.body.author,
    content: req.body.content,
    topic: req.params.topic,
    post: req.params.id
  });
  try {
    const comment = await newComment.save();
    if (!comment) throw Error("No comment");
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) throw Error("No post");

    post.comments.push(newComment);
    await post.save();
    res.status(200).json({ comment, status: "Comment succesfully added" });
  } catch (err) {
    res.status(400).json({ status: "Could not make comment" });
  }
});

// @route   GET /api/index/t/:topic/p/:id/c/:commentid
// @desc    Delete a comment
// @acess   Private

router.delete("/t/:topic/p/:id/c/:commentid", auth, async (req, res) => {
  try {
    await Post.updateOne(
      { _id: req.params.id },
      { $pull: { comments: req.params.commentid } },
      { useFindAndModify: true }
    );
    await Comment.deleteOne({ _id: req.params.commentid });
    res.status(200).json({
      id: req.params.commentid,
      status: "Comment succesfully deleted"
    });
  } catch (err) {
    res.status(400).json({ status: "Could not delete comment" });
  }
});

// @route   PUT /api/index/t/:topic/p/:id/c/:commentid
// @desc    Update a comment
// @acess   Private

router.put("/t/:topic/p/:id/c/:commentid", auth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndUpdate(
      { _id: req.params.commentid },
      { $set: { content: req.body.content } },
      { useFindAndModify: false, new: true }
    );
    if (!comment) throw Error("No comment");
    res.status(200).json({ status: "Comment successfully updated", comment });
  } catch (err) {
    res.status(400).json({ status: "Could not update post" });
  }
});

// @route   POST /api/index/t
// @desc    Create a topic
// @acess   Private

router.post("/t", auth, upload.single("file"), async (req, res) => {
  const newTopic = new Topic({
    title: req.body.title,
    description: req.body.description,
    imageURL: req.file ? req.file.location : "",
    imageName: req.file ? req.file.key : ""
  });
  try {
    let topic = await Topic.findOne({ title: req.body.title });
    if (topic) return res.json({ status: "Topic already exists" });
    topic = await newTopic.save();
    res.status(200).json({ topic, status: "Topic successfully created" });
  } catch (err) {
    res.status(400).json({ status: "Could not make topic" });
  }
});

// @route   GET /api/index/t/:topic
// @desc    Get a topic
// @acess   Public

router.get("/t/:topic", async (req, res) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic }).populate({
      path: "posts"
    });
    if (!topic) throw Error("No topic");
    res.status(200).json({ topic });
  } catch (err) {
    res.status(400).json({ status: "Could not find topic" });
  }
});

// @route   POST /api/index/t/:topic/followtopic
// @desc    Follow a topic
// @acess   Private

router.post("/t/:topic/followtopic", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.user }).select("-password");
    if (!user) throw Error("No user");

    if (user.followedTopics.includes(req.params.topic)) {
      user.followedTopics = user.followedTopics.filter(
        topic => topic !== req.params.topic
      );
      await user.save();
      res.status(200).json({ user, status: "Successfully unfollowed" });
    } else {
      user.followedTopics.push(req.params.topic);
      await user.save();
      res.status(200).json({ user, status: "Successfully followed" });
    }
  } catch (err) {
    res.status(400).json({ status: "Could not follow topic" });
  }
});

// @route   GET /api/index/t
// @desc    Get all topics
// @acess   Public

router.get("/t", async (req, res) => {
  try {
    const topics = await Topic.find();
    if (!topics) throw Error("No topics");
    res.json({ topics });
  } catch (err) {
    res.json({ status: "Could not get topics" });
  }
});

module.exports = router;
