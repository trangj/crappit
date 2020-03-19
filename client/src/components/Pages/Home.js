import React, { useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { List } from "@material-ui/core";
import PostItem from "../PostItem";
import AddPost from "../AddPost";

const Home = () => {
  const {
    fetchUser,
    posts,
    fetchPosts,
    deletePost,
    updatePost,
    user
  } = useContext(GlobalContext);

  useEffect(() => {
    fetchUser();
    fetchPosts();
  }, []);

  return (
    <>
      <AddPost />
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
