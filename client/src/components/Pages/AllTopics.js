import React, { useEffect, useContext } from "react";
import SkeletonList from "../SkeletonList";
import { List, ListItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

const AllTopics = () => {
  const { fetchTopics, topics, loading } = useContext(GlobalContext);

  useEffect(() => {
    fetchTopics();
  }, []);

  return loading ? (
    <SkeletonList />
  ) : (
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
