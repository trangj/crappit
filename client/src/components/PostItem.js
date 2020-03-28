import React, { useState } from "react";
import { ListItem, ListItemText, Icon, Card, Divider } from "@material-ui/core";
import Voting from "./Voting";
import { Link } from "react-router-dom";
import moment from "moment";

const PostItem = ({ post }) => {
  const [open, setOpen] = useState(false);

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <ListItem style={{ paddingBottom: "0" }}>
        <Voting post={post} />
        <ListItemText
          primary={
            <Link to={`/t/${post.topic}/p/${post._id}`}>{post.title}</Link>
          }
          secondary={
            <>
              Posted by {post.author} |{" "}
              <Link to={`/t/${post.topic}`}>t/{post.topic}</Link> |{" "}
              {post.comments.length} Comments | {moment(post.date).fromNow()}
            </>
          }
        />
      </ListItem>
      <div
        style={{ flex: 1, textAlign: "center" }}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <Icon style={{ fontSize: 15 }}>arrow_drop_up</Icon>
        ) : (
          <Icon style={{ fontSize: 15 }}>arrow_drop_down</Icon>
        )}
      </div>
      {open && (
        <>
          <Divider />
          <div id={post._id} style={{ margin: "1rem" }}>
            <img
              alt={post.imageName}
              src={post.imageURL}
              style={{
                display: "block",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            />
            {post.content}
          </div>
        </>
      )}
    </Card>
  );
};

export default PostItem;
