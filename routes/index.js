const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Post = require("../models/Post");

router.get("/", (req, res) => {
  Post.find()
    .then(posts => {
      res.json(posts);
    })
    .catch(err => res.json({ status: "Could not fetch posts" }));
});

router.post("/newpost", auth, (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    author: req.body.author,
    content: req.body.content
  });
  newPost
    .save()
    .then(result =>
      res.json({ status: "Post successfully created", post: result })
    )
    .catch(err => res.json({ status: "Could not create post" }));
});

router.delete("/:id/deletepost", auth, (req, res) => {
  Post.deleteOne({ _id: req.params.id })
    .then(result => res.json({ status: "Post successfully deleted" }))
    .catch(err => res.json({ status: "Error in deleting post" }));
});

router.put("/:id/updatepost", auth, (req, res) => {
  Post.findOneAndUpdate(
    { _id: req.params.id },
    { $set: { content: req.body.content, title: req.body.title } },
    { useFindAndModify: false, new: true },
    (err, result) => {
      if (err) return res.json({ status: "Could not update post" });
      return res.json({ status: "Post successfully updated", post: result });
    }
  );
});

module.exports = router;
