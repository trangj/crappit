import React, { useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";

const DeleteComment = ({ comment }) => {
  const { deleteComment } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">
          Are you sure you want to delete this comment?
        </DialogTitle>
        <DialogContent>
          <Button
            onClick={() => {
              deleteComment(comment.topic, comment.post, comment._id);
              setOpen(false);
            }}
            color="primary"
          >
            Yes, I regret posting it!
          </Button>
          <Button onClick={() => setOpen(false)} color="secondary">
            No, I like my comment!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeleteComment;
