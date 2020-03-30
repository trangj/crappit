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
// @access   Public

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .skip(parseInt(req.query.skip))
      .limit(10);
    if (!posts) throw Error("Could not fetch posts");
    res.status(200).json(posts);
  } catch (err) {
    res.status(400).json({ status: err.message });
  }
});

// @route   GET /api/index/t/:topic/p/:id
// @desc    Get a post
// @access   Public

router.get("/t/:topic/p/:id", async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id }).populate({
      path: "comments"
    });
    if (!post) throw Error("Could not fetch post");
    res.status(200).json({ post });
  } catch (err) {
    res.status(400).json({ status: err.message });
  }
});

// @route   POST /api/index/t/:topic/p
// @desc    Create post
// @access   Private

router.post("/t/:topic/p", auth, upload.single("file"), async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    author: req.user.username,
    authorId: req.user.id,
    content: req.body.content,
    topic: req.params.topic,
    imageURL: req.file ? req.file.location : "",
    imageName: req.file ? req.file.key : ""
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
      post
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: "error" } });
  }
});

// @route   DELETE /api/index/t/:topic/p/:id
// @desc    Delete a post
// @access   Private

router.delete("/t/:topic/p/:id", auth, async (req, res) => {
  try {
    const query = await Post.deleteOne({
      _id: req.params.id,
      authorId: req.user.id
    });
    if (!query.deletedCount)
      throw Error("Post does not exist or you are not the author");
    await Comment.deleteMany({ post: req.params.id });
    await Topic.updateOne(
      { title: req.params.topic },
      { $pull: { posts: req.params.id } }
    );
    res.status(200).json({
      status: { text: "Post successfully deleted", severity: "success" }
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: "error" } });
  }
});

// @route   PUT /api/index/t/:topic/p/:id
// @desc    Update a post
// @access   Private

router.put("/t/:topic/p/:id", auth, async (req, res) => {
  try {
    if (!req.body.content || !req.body.title)
      throw Error("Missing required fields");
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, authorId: req.user.id },
      { $set: { content: req.body.content, title: req.body.title } },
      { useFindAndModify: false, new: true }
    ).populate("comments");
    if (!post)
      throw Error("Post does not exist or you are not the author of the post");
    res.status(200).json({
      post,
      status: { text: "Post successfully updated", severity: "success" }
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: "error" } });
  }
});

// @route   PUT /api/index/t/:topic/p/:id/changevote
// @desc    Change vote on post
// @access   Private

router.put("/t/:topic/p/:id/changevote", auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.id });
    if (!post) throw Error("No post exists");
    const user = await User.findOne({ _id: req.user.id });
    if (!user) throw Error("No user exists");

    if (req.query.vote == "like") {
      if (post.likes.includes(req.user.id)) {
        return res.json({
          status: { text: "Already liked", severity: "error" }
        });
      }
      if (post.dislikes.includes(req.user.id)) {
        post.dislikes.pull(req.user.id);
      }
      post.likes.push(req.user.id);
      await post.save();
      res.status(200).json({ post });
    } else if (req.query.vote == "dislike") {
      if (post.dislikes.includes(req.user.id)) {
        return res.json({
          status: { text: "Already disliked", severity: "error" }
        });
      }
      if (post.likes.includes(req.user.id)) {
        post.likes.pull(req.user.id);
      }
      post.dislikes.push(req.user.id);
      await post.save();
      res.status(200).json({ post });
    }
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: "error" }
    });
  }
});

// @route   PUT /api/index/t/:topic/p/:id/c/:commentid/changevote
// @desc    Change vote on comment
// @access   Private

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
          return res.json({
            status: { text: "Already liked", severity: "error" }
          });
        }
        if (comment.dislikes.includes(req.user.id)) {
          comment.dislikes.pull(req.user.id);
        }
        comment.likes.push(req.user.id);
        await comment.save();
        res.status(200).json({ comment });
      } else if (req.query.vote == "dislike") {
        if (comment.dislikes.includes(req.user.id)) {
          return res.json({
            status: { text: "Already disliked", severity: "error" }
          });
        }
        if (comment.likes.includes(req.user.id)) {
          comment.likes.pull(req.user.id);
        }
        comment.dislikes.push(req.user.id);
        await comment.save();
        res.status(200).json({ comment });
      }
    } catch (err) {
      res.status(400).json({
        status: { text: err.message, severity: "error" }
      });
    }
  }
);

// @route   POST /api/index/t/:topic/p/:id
// @desc    Create a comment
// @access   Private

router.post("/t/:topic/p/:id", auth, async (req, res) => {
  const newComment = new Comment({
    author: req.user.username,
    authorId: req.user.id,
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
    res.status(200).json({
      comment,
      status: { text: "Comment succesfully added", severity: "success" }
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: "error" } });
  }
});

// @route   GET /api/index/t/:topic/p/:id/c/:commentid
// @desc    Delete a comment
// @access   Private

router.delete("/t/:topic/p/:id/c/:commentid", auth, async (req, res) => {
  try {
    const comment = await Comment.findOneAndDelete({
      _id: req.params.commentid,
      authorId: req.user.id
    });
    if (!comment)
      throw Error("Comment does not exist or you are not the author");
    res.status(200).json({
      comment,
      status: { text: "Comment succesfully deleted", severity: "success" }
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: "error" }
    });
  }
});

// @route   PUT /api/index/t/:topic/p/:id/c/:commentid
// @desc    Update a comment
// @access   Private

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
      comment
    });
  } catch (err) {
    res.status(400).json({
      status: { text: err.message, severity: "error" }
    });
  }
});

// @route   POST /api/index/t
// @desc    Create a topic
// @access   Private

router.post("/t", auth, upload.single("file"), async (req, res) => {
  const newTopic = new Topic({
    title: req.body.title,
    description: req.body.description,
    imageURL: req.file ? req.file.location : "",
    imageName: req.file ? req.file.key : ""
  });
  try {
    let topic = await Topic.findOne({ title: req.body.title });
    if (topic)
      return res.json({
        status: { text: "Topic already exists", severity: "error" }
      });
    topic = await newTopic.save();
    res.status(200).json({
      topic,
      status: { text: "Topic successfully created", severity: "success" }
    });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: "error" } });
  }
});

// @route   GET /api/index/t/:topic
// @desc    Get a topic
// @access   Public

router.get("/t/:topic", async (req, res) => {
  try {
    const topic = await Topic.findOne({ title: req.params.topic });
    if (!topic) throw Error("Topic does not exist");
    const posts = await Post.find({ topic: req.params.topic })
      .skip(parseInt(req.query.skip))
      .limit(10);
    if (!posts) throw Error("No posts found");
    res.status(200).json({ topic, posts });
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: "error" } });
  }
});

// @route   POST /api/index/t/:topic/followtopic
// @desc    Follow a topic
// @access   Private

router.post("/t/:topic/followtopic", auth, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.id }).select("-password");
    if (!user) throw Error("No user exists");

    if (user.followedTopics.includes(req.params.topic)) {
      user.followedTopics = user.followedTopics.filter(
        topic => topic !== req.params.topic
      );
      await user.save();
      res.status(200).json({
        user,
        status: { text: "Successfully unfollowed", severity: "success" }
      });
    } else {
      user.followedTopics.push(req.params.topic);
      await user.save();
      res.status(200).json({
        user,
        status: { text: "Successfully followed", severity: "success" }
      });
    }
  } catch (err) {
    res.status(400).json({ status: { text: err.message, severity: "error" } });
  }
});

// @route   GET /api/index/t
// @desc    Get all topics
// @access   Public

router.get("/t", async (req, res) => {
  try {
    const topics = await Topic.find();
    if (!topics) throw Error("Could not get topics");
    res.status(200).json({ topics });
  } catch (err) {
    res.status(400).json({ status: { text: err.message }, severity: "error" });
  }
});

// @route   GET /api/index/search
// @desc    Search for a topic or post
// @access  Public

router.get("/search", async (req, res) => {
  try {
    const topics = await Topic.find(
      { title: { $regex: req.query.value, $options: "i" } },
      "title"
    );
    const posts = await Post.find(
      { title: { $regex: req.query.value, $options: "i" } },
      "title topic author date"
    );
    res.json([...topics, ...posts]);
  } catch (err) {
    res.json({ status: err.message });
  }
});

// @route   POST /api/index/t/:topic/p/:id/c/:commentid/reply
// @desc    Add a reply to a comment
// @access  Public

router.post("/t/:topic/p/:id/c/:commentid/reply", auth, async (req, res) => {
  const newComment = new Comment({
    author: req.user.username,
    authorId: req.user.id,
    content: req.body.content,
    topic: req.params.topic,
    post: req.params.id,
    comment: req.params.commentid
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
      status: { text: "reply made successfully", severity: "success" }
    });
  } catch (err) {
    res.status(400).json({
      status: { text: "Could not reply to comment", severity: "error" }
    });
  }
});

module.exports = router;
