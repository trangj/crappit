import React, { useEffect, useContext, useState } from "react";
import PostCard from "../PostCard";
import CommentCard from "../CommentCard";
import SkeletonCard from "../Utils/SkeletonCard";
import { GlobalContext } from "../../context/GlobalState";

const Post = ({ match }) => {
  const [componentLoading, setLoading] = useState(true);
  const { fetchPost, loading } = useContext(GlobalContext);

  useEffect(() => {
    fetchPost(match.params.topic, match.params.id);
    setLoading(false);
    // eslint-disable-next-line
  }, [match.params.topic, match.params.id]);

  return loading || componentLoading ? (
    <SkeletonCard />
  ) : (
    <>
      <PostCard />
      <CommentCard />
    </>
  );
};

export default Post;
