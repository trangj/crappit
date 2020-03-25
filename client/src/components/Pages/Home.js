import React, { useEffect, useContext, useState } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { List } from "@material-ui/core";
import PostItem from "../PostItem";
import SkeletonList from "../SkeletonList";

const Home = () => {
  const {
    posts,
    fetchPosts,
    deletePost,
    updatePost,
    user,
    loading
  } = useContext(GlobalContext);
  const [componentLoading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    setLoading(false);
  }, []);

  return loading || componentLoading ? (
    <SkeletonList />
  ) : (
    <>
      <List>
        {posts.map(post => (
          <PostItem
            post={post}
            key={post._id}
            deletePost={deletePost}
            updatePost={updatePost}
            user={user}
          />
        ))}
      </List>
    </>
  );
};

export default Home;
