import React, { useEffect, useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import PostItem from "../PostItem";
import TopicCard from "../TopicCard";
import SkeletonList from "../SkeletonList";
import CircularProgress from "@material-ui/core/CircularProgress";
import InfiniteScroll from "react-infinite-scroll-component";

const Topic = ({ match }) => {
  const { posts, fetchTopic, moreTopic, loading } = useContext(GlobalContext);
  const [componentLoading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

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
      <InfiniteScroll
        dataLength={posts.length}
        next={() => {
          setFetching(true);
          moreTopic(match.params.topic, posts.length);
          setFetching(false);
        }}
        hasMore={true}
      >
        {posts.map(post => (
          <PostItem post={post} key={post._id} />
        ))}
      </InfiniteScroll>
      {fetching && (
        <CircularProgress
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: "1rem"
          }}
        />
      )}
    </>
  );
};

export default Topic;
