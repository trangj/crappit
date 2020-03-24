import React from "react";
import moment from "moment";
import Voting from "./Voting";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  Divider
} from "@material-ui/core";
import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardMedia component="img" alt={post.imageName} src={post.imageURL} />
      <CardContent>
        <Grid container>
          {post && (
            <Grid item>
              <Voting post={post} />
            </Grid>
          )}
          <Grid item style={{ marginTop: "1rem" }}>
            <Typography gutterBottom variant="h5" component="h2">
              {post.title}
            </Typography>
            <Typography gutterBottom>
              Posted by {post.author} |{" "}
              <Link to={`/t/${post.topic}`}>t/{post.topic}</Link> |{" "}
              {moment(post.date).fromNow()}
            </Typography>
          </Grid>
        </Grid>
        <Divider style={{ margin: "1rem 0rem 1rem" }} />
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;
