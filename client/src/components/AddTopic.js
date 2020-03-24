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
import { set } from "mongoose";

const AddTopic = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState("");

  const { addTopic, user } = useContext(GlobalContext);

  const handleSubmit = () => {
    if (!title || !description) return;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    addTopic(formData);
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  const changeUpload = e => {
    setFile(e.target.files[0]);
  };

  return user ? (
    <>
      <div className="mt-4" onClick={() => setOpen(true)} style={{ flex: 1 }}>
        Create Topic
      </div>
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
              value={description}
              multiline
              onChange={e => setDescription(e.target.value)}
              fullWidth
              label="Description"
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
            Create Topic
          </Button>
        </DialogActions>
      </Dialog>
    </>
  ) : null;
};

export default AddTopic;
