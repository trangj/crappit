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
    <Card>
      <CardMedia
        component="img"
        height="140"
        alt="img"
        src="https://glowvarietyshow.com/wp-content/uploads/2017/03/placeholder-image.jpg"
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          Welcome to t/{topic.title}!
        </Typography>
        <Typography gutterBottom>{topic.description}</Typography>
        <Button onClick={() => followTopic(topic.title, { user: user._id })}>
          {user && user.followedTopics.includes(topic.title)
            ? "Unfollow"
            : "Follow"}
        </Button>
        <AddPost />
      </CardContent>
    </Card>
  );
};

export default TopicCard;
