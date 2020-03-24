import React, { useContext } from "react";
import AddPost from "./AddPost";
import { GlobalContext } from "../context/GlobalState";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button
} from "@material-ui/core";

const TopicCard = () => {
  const { topic, followTopic, user } = useContext(GlobalContext);

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
          <Button onClick={() => followTopic(topic.title, { user: user._id })}>
            {user.followedTopics.includes(topic.title) ? "Unfollow" : "Follow"}
          </Button>
        )}
        <AddPost />
      </CardContent>
    </Card>
  );
};

export default TopicCard;
