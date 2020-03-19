const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");
const Comment = require("../models/Comment");

router.get("/", (req, res) => {
  Post.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.json({ status: "Could not fetch posts" }));
});

router.get("/:id", (req, res) => {
  Post.findOne({ _id: req.params.id })
    .populate({ path: "comments" })
    .then(post => {
      res.json({ post });
    })
    .catch(err => res.json({ status: "Could not fetch post" }));
});

router.post("/newpost", auth, (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content
  });
  newPost
    .save()
    .then(post => res.json({ status: "Post successfully created", post }))
    .catch(err => res.json({ status: "Could not create post" }));
});

router.delete("/:id/deletepost", auth, (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result =>
      res.json({ id: req.params.id, status: "Post successfully deleted" })
    )
    .catch(err => res.json({ status: "Error in deleting post" }));
});

router.put("/:id/updatepost", auth, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { content: req.body.content, title: req.body.title } },
    { useFindAndModify: false, new: true },
    (err, post) => {
      if (err) return res.json({ status: "Could not update post" });
      return res.json({ status: "Post successfully updated", post });
    }
  );
});

router.post("/:id/changevote", (req, res) => {
  Post.findOne({ _id: req.params.id }).then(post => {
    User.findOne({ _id: req.body.user }).then(user => {
      if (req.query.vote == "like") {
        if (post.likes.includes(user._id)) {
          return res.json({ status: "Already liked." });
        }
        if (post.dislikes.includes(user._id)) {
          post.dislikes.pull(user._id);
        }
        post.likes.push(user._id);
        post
          .save()
          .then(post => res.json({ post, status: "Successfully liked" }))
          .catch(err => res.json({ status: "Could not like post" }));
      } else if (req.query.vote == "dislike") {
        if (post.dislikes.includes(user._id)) {
          return res.json({ status: "Already disliked." });
        }
        if (post.likes.includes(user._id)) {
          post.likes.pull(user._id);
        }
        post.dislikes.push(user._id);
        post
          .save()
          .then(post => res.json({ post, status: "Successfully disliked" }))
          .catch(err => res.json({ status: "Could not dislike post" }));
      }
    });
  });
});

router.post("/:id/newcomment", auth, (req, res) => {
  const newComment = new Comment({
    author: req.body.author,
    content: req.body.content
  });

  newComment.save().then(comment => {
    Post.findOne({ _id: req.params.id }).then(post => {
      post.comments.push(newComment);
      post
        .save()
        .then(post =>
          res.json({ comment, status: "Comment succesfully added" })
        )
        .catch(err => res.json({ status: "Could not make comment" }));
    });
  });
});

router.delete("/:id/c/:commentid/deletecomment", auth, (req, res) => {
  Post.updateOne(
    { _id: req.params.id },
    { $pull: { comments: req.params.commentid } },
    { useFindAndModify: true }
  ).then(
    Comment.deleteOne({ _id: req.params.commentid })
      .then(result =>
        res.json({
          id: req.params.commentid,
          status: "Comment succesfully deleted"
        })
      )
      .catch(err => res.json({ status: "Could not delete comment" }))
  );
});

router.put("/:id/c/:commentid/updatecomment", auth, (req, res) => {
  Comment.findOneAndUpdate(
    { _id: req.params.commentid },
    { $set: { content: req.body.content } },
    { useFindAndModify: false, new: true },
    (err, comment) => {
      if (err) return res.json({ status: "Could not update post" });
      return res.json({ status: "Post successfully updated", comment });
    }
  );
});

module.exports = router;
