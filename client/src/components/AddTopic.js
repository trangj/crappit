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

const AddTopic = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const { addTopic, user } = useContext(GlobalContext);

  const handleSubmit = e => {
    e.preventDefault();
    const newTopic = {
      title,
      description
    };
    addTopic(newTopic);
    setTitle("");
    setDescription("");
    setOpen(false);
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
