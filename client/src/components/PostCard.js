import React from "react";
import moment from "moment";
import Voting from "./Voting";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid
} from "@material-ui/core";

const PostCard = ({ post }) => {
  return (
    <Card>
      <CardMedia
        component="img"
        height="140"
        alt="img"
        src="https://glowvarietyshow.com/wp-content/uploads/2017/03/placeholder-image.jpg"
      />
      <CardContent>
        <Grid container>
          <Grid item>
            {Object.keys(post).length !== 0 && <Voting post={post} />}
          </Grid>
          <Grid item>
            <div style={{ marginTop: "1rem", marginLeft: "1rem" }}>
              <Typography gutterBottom variant="h5" component="h2">
                {post.title}
              </Typography>
              Posted by {post.author} | {moment(post.date).fromNow()}
            </div>
          </Grid>
        </Grid>
        <Typography variant="body2" component="p" style={{ marginTop: "1rem" }}>
          {post.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default PostCard;
