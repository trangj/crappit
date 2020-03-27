import React, { useContext } from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import CommentVoting from "./CommentVoting";
import moment from "moment";
import { GlobalContext } from "../context/GlobalState";

const CommentItem = ({ comment }) => {
  const { user } = useContext(GlobalContext);

  return (
    <ListItem>
      <CommentVoting comment={comment} />
      <ListItemText
        primary={comment.content}
        secondary={`Commented by ${comment.author} | ${moment(
          comment.date
        ).fromNow()}`}
      />
      {user !== undefined && user._id === comment.authorId ? (
        <>
          <DeleteComment comment={comment} />
          <UpdateComment comment={comment} />
        </>
      ) : null}
    </ListItem>
  );
};

export default CommentItem;
