import React, { useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import PostItem from "../PostItem";
import TopicCard from "../TopicCard";
import SkeletonCard from "../SkeletonCard";

const Topic = ({ match }) => {
  const {
    posts,
    fetchTopic,
    deletePost,
    updatePost,
    user,
    loading
  } = useContext(GlobalContext);

  useEffect(() => {
    fetchTopic(match.params.topic);
  }, [match.params.topic]);

  return loading ? (
    <SkeletonCard />
  ) : (
    <>
      <TopicCard />
      {posts.map(post => (
        <PostItem
          post={post}
          key={post._id}
          deletePost={deletePost}
          updatePost={updatePost}
          user={user}
        />
      ))}
    </>
  );
};

export default Topic;
