import React, { useContext, useState } from "react";
import AddPost from "./AddPost";
import { GlobalContext } from "../context/GlobalState";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Icon,
  Divider,
} from "@material-ui/core";

const TopicCard = () => {
  const { topic, followTopic, user } = useContext(GlobalContext);
  const [open, setOpen] = useState(false);

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardMedia component="img" alt={topic.imageName} src={topic.imageURL} />
      <CardContent>
        <Typography
          gutterBottom
          variant="h5"
          component="h2"
          style={{ marginTop: "1rem" }}
        >
          Welcome to t/{topic.title}!
        </Typography>
        <Typography gutterBottom>{topic.description}</Typography>
        {user && (
          <Button onClick={() => followTopic(topic.title)}>
            {user.followedTopics.includes(topic.title) ? "Unfollow" : "Follow"}
          </Button>
        )}
        <AddPost />
      </CardContent>
      <div
        style={{ flex: 1, textAlign: "center", cursor: "pointer" }}
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <Icon style={{ fontSize: 15 }}>arrow_drop_up</Icon>
        ) : (
          <Icon style={{ fontSize: 15 }}>arrow_drop_down</Icon>
        )}
      </div>
      {open && (
        <>
          <Divider />
          <div style={{ margin: "1rem" }}>
            <h4>Rules</h4>
            <h4>Moderators</h4>
          </div>
        </>
      )}
    </Card>
  );
};

export default TopicCard;
