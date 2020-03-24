import React, { useEffect, useContext } from "react";
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

  useEffect(() => {
    fetchPosts();
  }, []);

  return loading ? (
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
