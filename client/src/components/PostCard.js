import React, { useContext } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Grid,
  Divider
} from "@material-ui/core";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import moment from "moment";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";

const PostCard = () => {
  const { post, user } = useContext(GlobalContext);

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
              Posted by <Link to={`/u/${post.authorId}`}> {post.author} </Link>{" "}
              | <Link to={`/t/${post.topic}`}>t/{post.topic}</Link> |{" "}
              {moment(post.date).fromNow()}
            </Typography>
          </Grid>
        </Grid>
        <Divider style={{ margin: "1rem 0rem 1rem" }} />
        <Typography variant="body1">{post.content}</Typography>
      </CardContent>
      {user && user._id === post.authorId && (
        <CardActions style={{ float: "right" }}>
          <DeletePost post={post} />
          <UpdatePost post={post} />
        </CardActions>
      )}
    </Card>
  );
};

export default PostCard;
