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
    deletePost(post.topic, post._id);
  };

  return (
    <Card style={{ marginBottom: "1rem" }}>
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
          primary={<Link to={`/t/${post.topic}/p/${post._id}`}>{title}</Link>}
          secondary={
            <>
              Posted by {post.author} |{" "}
              <Link to={`/t/${post.topic}`}>t/{post.topic}</Link> |{" "}
              {post.comments.length} Comments | {moment(date).fromNow()}
            </>
          }
        />
        {user !== undefined && user.username === post.author ? (
          <>
            <Button onClick={handleDelete}>Delete</Button>
            <UpdatePost updatePost={updatePost} post={post} />
          </>
        ) : null}
      </ListItem>
      <Collapse in={open}>
        <div id={post._id} style={{ margin: "0rem 1rem 1rem 1rem" }}>
          <img
            alt={post.imageName}
            src={post.imageURL}
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          />
          <br />
          {content}
        </div>
      </Collapse>
    </Card>
  );
};

export default PostItem;
