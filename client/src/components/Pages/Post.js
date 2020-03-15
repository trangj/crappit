import React, { useEffect, useContext } from "react";
import PostCard from "../PostCard";
import { GlobalContext } from "../../context/GlobalState";

const Post = ({ match }) => {
  const { fetchPost, post, user } = useContext(GlobalContext);

  useEffect(() => {
    fetchPost(match.params.id);
  }, []);

  return (
    <>
      <PostCard post={post} />
    </>
  );
};

export default Post;
