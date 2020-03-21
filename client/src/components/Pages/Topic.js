import React, { useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { List, Typography } from "@material-ui/core";
import PostItem from "../PostItem";
import AddPost from "../AddPost";

const Topic = ({ match }) => {
  const {
    fetchUser,
    posts,
    fetchTopic,
    deletePost,
    updatePost,
    user,
    topic
  } = useContext(GlobalContext);

  useEffect(() => {
    fetchUser();
    fetchTopic(match.params.topic);
  }, []);

  return (
    <>
      <Typography>Welcome to t/{topic.title}!</Typography>
      <Typography>{topic.description}</Typography>
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

export default Topic;
