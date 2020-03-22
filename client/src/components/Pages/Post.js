import React, { useEffect, useContext } from "react";
import PostCard from "../PostCard";
import CommentCard from "../CommentCard";
import { GlobalContext } from "../../context/GlobalState";

const Post = ({ match }) => {
  const { fetchUser, fetchPost, post } = useContext(GlobalContext);

  useEffect(() => {
    fetchUser();
    fetchPost(match.params.topic, match.params.id);
  }, [match.params.topic, match.params.id]);

  return (
    <>
      <PostCard post={post} />
      <CommentCard post={post} />
    </>
  );
};

export default Post;
