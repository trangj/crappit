import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Collapse,
  IconButton,
  Icon
} from "@material-ui/core";
import UpdatePost from "./UpdatePost";
import moment from "moment";
import { Link } from "react-router-dom";

const PostItem = ({ post, deletePost, updatePost, user }) => {
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
            aria-controls={post._id}
            aria-expanded={open}
          >
            {open ? <Icon>fullscreen_exit</Icon> : <Icon>fullscreen</Icon>}
          </IconButton>
        </ListItemIcon>
        <ListItemText
          primary={
            <Link to={`/${post._id}`} style={{ textDecoration: "none" }}>
              {title}
            </Link>
          }
          secondary={`Posted by ${post.author} | ${moment(date).fromNow()} `}
        />
        {user !== undefined && user.username === post.author ? (
          <>
            <Button onClick={handleDelete}>Delete</Button>
            <UpdatePost updatePost={updatePost} post={post} />
          </>
        ) : null}
      </ListItem>
      <Collapse in={open}>
        <div id={post._id}>
          <p>{content}</p>
        </div>
      </Collapse>
    </React.Fragment>
  );
};

export default PostItem;
