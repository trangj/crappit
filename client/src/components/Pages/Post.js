import React, { useEffect, useContext } from "react";
import PostCard from "../PostCard";
import CommentCard from "../CommentCard";
import SkeletonCard from "../SkeletonCard";
import { GlobalContext } from "../../context/GlobalState";

const Post = ({ match }) => {
  const { fetchPost, post, loading } = useContext(GlobalContext);

  useEffect(() => {
    fetchPost(match.params.topic, match.params.id);
  }, [match.params.topic, match.params.id]);

  console.log(loading);
  console.log(post);

  return loading ? (
    <SkeletonCard />
  ) : (
    <>
      <PostCard post={post} />
      <CommentCard post={post} />
    </>
  );
};

export default Post;
