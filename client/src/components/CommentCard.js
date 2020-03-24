import React, { useState, useContext } from "react";
import CommentItem from "./CommentItem";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button
} from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";

const CommentCard = ({ post }) => {
  const { comments } = post;
  const [content, setContent] = useState("");
  const { user, addComment } = useContext(GlobalContext);

  const handleSubmit = () => {
    if (!content) return;
    const newComment = {
      content,
      author: user.username
    };
    setContent("");
    addComment(post.topic, post._id, newComment);
  };

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Comments
        </Typography>
        {user && (
          <>
            <TextField
              title="Comment"
              placeholder="Make a comment..."
              multiline
              rows="4"
              fullWidth
              value={content}
              onChange={e => setContent(e.target.value)}
            />
            <Button
              onClick={handleSubmit}
              style={{ display: "flex", marginLeft: "auto" }}
            >
              Post
            </Button>
          </>
        )}
        {comments &&
          comments.map(comment => (
            <CommentItem comment={comment} key={comment._id} />
          ))}
      </CardContent>
    </Card>
  );
};

export default CommentCard;
