import React, { useContext, useEffect } from "react";
import PostItem from "./PostItem";
import List from "@material-ui/core/List";

import { GlobalContext } from "../context/GlobalState";

const PostList = () => {
  const { posts, fetchPosts, deletePost, updatePost, user } = useContext(
    GlobalContext
  );

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
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
  );
};

export default PostList;
