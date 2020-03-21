import React, { useContext, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";

const UpdateComment = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState(comment.content);
  const { updateComment, post } = useContext(GlobalContext);

  const handleSubmit = e => {
    e.preventDefault();
    const newComment = {
      content
    };
    updateComment(post.topic, post._id, comment._id, newComment);
    setOpen(false);
  };

  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">Edit</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
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
            Edit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UpdateComment;
