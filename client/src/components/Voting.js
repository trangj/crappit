import React, { useContext } from "react";
import { Button, ButtonGroup, Icon } from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";

const Voting = ({ post }) => {
  const { user, changeVote } = useContext(GlobalContext);

  const handleUpvote = () => {
    changeVote(post.topic, post._id, "like");
  };

  const handleDownvote = () => {
    changeVote(post.topic, post._id, "dislike");
  };

  return user && post.likes && post.dislikes ? (
    <ButtonGroup
      orientation="vertical"
      variant="text"
      size="small"
      style={{ marginRight: "1rem" }}
    >
      {post.likes.includes(user._id) ? (
        <Button disabled>
          <Icon>keyboard_arrow_up</Icon>
        </Button>
      ) : (
        <Button onClick={handleUpvote}>
          <Icon>keyboard_arrow_up</Icon>
        </Button>
      )}
      <Button disabled>{post.likes.length - post.dislikes.length}</Button>
      {post.dislikes.includes(user._id) ? (
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

export default Voting;
