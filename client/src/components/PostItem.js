import React, { useState } from "react";
import {
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  Collapse,
  IconButton,
  Icon,
  Card
} from "@material-ui/core";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import moment from "moment";
import { Link } from "react-router-dom";

const PostItem = ({ post, deletePost, updatePost, user }) => {
  const [open, setOpen] = useState(false);
  const { title, content, date } = post;

  const handleDelete = () => {
    deletePost(post._id);
  };

  return (
    <Card style={{ marginTop: "1rem" }}>
      <ListItem>
        <Voting post={post} />
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
            <Link
              to={`/${post._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
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
        <div id={post._id} style={{ marginLeft: "2rem" }}>
          <p>{content}</p>
        </div>
      </Collapse>
    </Card>
  );
};

export default PostItem;
