import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@material-ui/core";

const PostCard = ({ post }) => {
  return (
    <>
      <Card>
        <CardMedia
          component="img"
          height="140"
          alt="img"
          src="https://glowvarietyshow.com/wp-content/uploads/2017/03/placeholder-image.jpg"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {post.title}
          </Typography>
          <Typography variant="body2" component="p">
            Posted by {post.author} | {post.date}
          </Typography>
          <hr />
          <Typography variant="body2" component="p">
            {post.content}
          </Typography>
        </CardContent>
      </Card>
    </>
  );
};

export default PostCard;
