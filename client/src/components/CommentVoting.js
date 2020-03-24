import React, { useContext } from "react";
import { Button, ButtonGroup, Icon } from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";

const CommentVoting = ({ comment }) => {
  const { topic, user, changeCommentVote } = useContext(GlobalContext);

  const handleUpvote = () => {
    const id = {
      user: user._id
    };
    changeCommentVote(topic.title, comment.post, comment._id, "like", id);
  };

  const handleDownvote = () => {
    const id = {
      user: user._id
    };
    changeCommentVote(topic.title, comment.post, comment._id, "dislike", id);
  };

  return user ? (
    <ButtonGroup
      orientation="vertical"
      variant="text"
      size="small"
      style={{ marginRight: "1rem" }}
    >
      {comment.likes.includes(user._id) ? (
        <Button disabled>
          <Icon>keyboard_arrow_up</Icon>
        </Button>
      ) : (
        <Button onClick={handleUpvote}>
          <Icon>keyboard_arrow_up</Icon>
        </Button>
      )}
      <Button disabled>{comment.likes.length - comment.dislikes.length}</Button>
      {comment.dislikes.includes(user._id) ? (
        <Button disabled>
          <Icon>keyboard_arrow_down</Icon>
        </Button>
      ) : (
        <Button onClick={handleDownvote}>
          <Icon>keyboard_arrow_down</Icon>
        </Button>
      )}
    </ButtonGroup>
  ) : null;
};

export default CommentVoting;
