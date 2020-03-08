import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Collapse,
  IconButton
} from "@material-ui/core";
import UpdatePost from "./UpdatePost";

const PostItem = ({ post, deletePost, updatePost }) => {
  const [open, setOpen] = useState(false);
  const { title, content, date } = post;

  const handleDelete = () => {
    deletePost(post._id);
  };

  return (
    <React.Fragment>
      <ListItem>
        <ListItemIcon>
          <IconButton
            onClick={() => setOpen(!open)}
            aria-controls={post.id}
            aria-expanded={open}
          >
            {open ? <i class="fas fa-minus"></i> : <i class="fas fa-plus"></i>}
          </IconButton>
        </ListItemIcon>
        <ListItemText primary={title} secondary={date} />
        <Button onClick={handleDelete}>Delete</Button>
        <UpdatePost updatePost={updatePost} post={post} />
      </ListItem>
      <Collapse in={open}>
        <div id={post.id}>
          <p>{content}</p>
        </div>
      </Collapse>
    </React.Fragment>
  );
};

export default PostItem;
