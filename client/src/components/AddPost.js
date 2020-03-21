import React, { useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";

import { GlobalContext } from "../context/GlobalState";

const AddPost = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { topic, addPost, user } = useContext(GlobalContext);

  const handleSubmit = e => {
    e.preventDefault();
    const newPost = {
      title,
      author: user.username,
      content
    };
    addPost(topic.title, newPost);
    setTitle("");
    setContent("");
    setOpen(false);
  };

  return user ? (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Add Post
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">Add a post!</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              id="standard-basic"
              value={title}
              onChange={e => setTitle(e.target.value)}
              fullWidth
              label="Title"
            />
            <TextField
              id="standard-basic"
              value={content}
              multiline
              onChange={e => setContent(e.target.value)}
              fullWidth
              label="Content"
              rows="4"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSubmit} color="primary">
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null;
};

export default AddPost;
