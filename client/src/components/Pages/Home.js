import React, { useEffect, useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import PostItem from "../PostItem";
import SkeletonList from "../SkeletonList";
import InfiniteScroll from "react-infinite-scroll-component";
import CircularProgress from "@material-ui/core/CircularProgress";

const Home = () => {
  const { posts, fetchPosts, morePosts, loading } = useContext(GlobalContext);
  const [componentLoading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    fetchPosts();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  return loading || componentLoading ? (
    <SkeletonList />
  ) : (
    <>
      <InfiniteScroll
        dataLength={posts.length}
        next={() => {
          setFetching(true);
          morePosts(posts.length);
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

export default Home;
