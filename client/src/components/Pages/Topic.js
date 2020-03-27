import React, { useEffect, useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import PostItem from "../PostItem";
import TopicCard from "../TopicCard";
import SkeletonList from "../SkeletonList";

const Topic = ({ match }) => {
  const { posts, fetchTopic, loading } = useContext(GlobalContext);
  const [componentLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopic(match.params.topic);
    setLoading(false);
    // eslint-disable-next-line
  }, [match.params.topic]);

  return loading || componentLoading ? (
    <SkeletonList />
  ) : (
    <>
      <TopicCard />
      {posts.map(post => (
        <PostItem post={post} key={post._id} />
      ))}
    </>
  );
};

export default Topic;
