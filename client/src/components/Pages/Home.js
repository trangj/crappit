import React, { useEffect, useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { List } from "@material-ui/core";
import PostItem from "../PostItem";
import SkeletonList from "../SkeletonList";

const Home = () => {
  const { posts, fetchPosts, loading } = useContext(GlobalContext);
  const [componentLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    setLoading(false);
    // eslint-disable-next-line
  }, []);

  return loading || componentLoading ? (
    <SkeletonList />
  ) : (
    <>
      <List>
        {posts.map(post => (
          <PostItem post={post} key={post._id} />
        ))}
      </List>
    </>
  );
};

export default Home;
