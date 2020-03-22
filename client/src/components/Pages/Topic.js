import React, { useEffect, useContext } from "react";
import { GlobalContext } from "../../context/GlobalState";
import { List } from "@material-ui/core";
import PostItem from "../PostItem";
import TopicCard from "../TopicCard";

const Topic = ({ match }) => {
  const {
    fetchUser,
    posts,
    fetchTopic,
    deletePost,
    updatePost,
    user
  } = useContext(GlobalContext);

  useEffect(() => {
    fetchUser();
    fetchTopic(match.params.topic);
  }, [match.params.topic]);

  return (
    <>
      <TopicCard />
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
