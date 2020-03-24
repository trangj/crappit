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
  const [file, setFile] = useState("");

  const { topic, addPost, user } = useContext(GlobalContext);

  const handleSubmit = () => {
    if (!title || !content) return;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("author", user.username);
    formData.append("content", content);
    addPost(topic.title, formData);
    setTitle("");
    setContent("");
    setOpen(false);
  };

  const changeUpload = e => {
    setFile(e.target.files[0]);
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
            <Button component="label">
              Upload File
              <input
                type="file"
                style={{ display: "none" }}
                onChange={changeUpload}
              />
            </Button>
            {file.name}
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
