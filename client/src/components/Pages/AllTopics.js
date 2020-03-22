import React, { useEffect, useContext } from "react";
import { List, ListItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

const AllTopics = () => {
  const { fetchUser, fetchTopics, topics } = useContext(GlobalContext);

  useEffect(() => {
    fetchUser();
    fetchTopics();
  });

  return (
    <List>
      {topics.map(topic => (
        <ListItem button component={Link} to={`/t/${topic.title}`}>
          t/{topic.title}
        </ListItem>
      ))}
    </List>
  );
};

export default AllTopics;
