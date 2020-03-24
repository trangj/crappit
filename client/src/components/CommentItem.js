import React, { useContext } from "react";
import { ListItem, ListItemText, Button } from "@material-ui/core";
import UpdateComment from "./UpdateComment";
import CommentVoting from "./CommentVoting";
import moment from "moment";
import { GlobalContext } from "../context/GlobalState";

const CommentItem = ({ comment }) => {
  const { deleteComment, post, user } = useContext(GlobalContext);

  const handleDelete = () => {
    deleteComment(post.topic, post._id, comment._id);
  };

  return (
    <ListItem>
      <CommentVoting comment={comment} />
      <ListItemText
        primary={comment.content}
        secondary={`Commented by ${comment.author} | ${moment(
          comment.date
        ).fromNow()}`}
      />
      {user !== undefined && user.username === comment.author ? (
        <>
          <Button onClick={handleDelete}>Delete</Button>
          <UpdateComment comment={comment} />
        </>
      ) : null}
    </ListItem>
  );
};

export default CommentItem;
