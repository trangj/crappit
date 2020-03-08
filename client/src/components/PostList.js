import React from "react";
import PostItem from "./PostItem";
import List from "@material-ui/core/List";

const PostList = ({ posts, deletePost, updatePost }) => {
  return (
    <List>
      {posts.map(post => (
        <PostItem
          post={post}
          key={post._id}
          deletePost={deletePost}
          updatePost={updatePost}
        />
      ))}
    </List>
  );
};

export default PostList;
