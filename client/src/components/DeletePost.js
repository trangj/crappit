import React, { useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";
import { Redirect } from "react-router-dom";

const DeletePost = ({ post }) => {
  const { deletePost } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);
  const [redirect, setRedirect] = useState(false);

  if (redirect) return <Redirect to={`/t/${post.topic}`} />;

  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Delete
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">
          Are you sure you want to delete this post?
        </DialogTitle>
        <DialogContent>
          <Button
            onClick={() => {
              deletePost(post.topic, post._id);
              setRedirect(true);
            }}
            color="secondary"
          >
            Yes, I regret posting it!
          </Button>
          <Button onClick={() => setOpen(false)} color="primary">
            No, I like my post!
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeletePost;
