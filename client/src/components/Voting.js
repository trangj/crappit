import React, { useContext } from "react";
import { Button, ButtonGroup, Icon } from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";

const Voting = ({ post }) => {
  const { user, changeVote } = useContext(GlobalContext);

  const handleUpvote = () => {
    const id = {
      post: post._id,
      user: user._id
    };
    changeVote("like", id);
  };

  const handleDownvote = () => {
    const id = {
      post: post._id,
      user: user._id
    };
    changeVote("dislike", id);
  };

  return user ? (
    <ButtonGroup orientation="vertical" variant="text" size="small">
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
