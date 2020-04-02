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
              Posted by
              <Link to={`/u/${post.authorId}`}> {post.author}</Link> |{" "}
              <Link to={`/t/${post.topic}`}>t/{post.topic}</Link> |{" "}
              <Link to={`/t/${post.topic}/p/${post._id}#comments`}>
                {post.comments.length} Comments
              </Link>{" "}
              | {moment(post.date).fromNow()}
            </>
          }
        />
      </ListItem>
      <div
        style={{ flex: 1, textAlign: "center", cursor: "pointer" }}
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
                maxWidth: "100%",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            />
            <p>{post.content}</p>
          </div>
        </>
      )}
    </Card>
  );
};

export default PostItem;
