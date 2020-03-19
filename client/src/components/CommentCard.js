import React, { useState, useContext } from "react";
import CommentItem from "./CommentItem";
import {
  Card,
  CardContent,
  Typography,
  List,
  TextField,
  Button
} from "@material-ui/core";
import { GlobalContext } from "../context/GlobalState";

const CommentCard = ({ post }) => {
  const { comments } = post;
  const [content, setContent] = useState([]);
  const { user, addComment } = useContext(GlobalContext);

  const handleSubmit = e => {
    e.preventDefault();
    const newComment = {
      id: post._id,
      content,
      author: user.username
    };
    setContent("");
    addComment(newComment);
  };

  return (
    <Card style={{ marginTop: "2rem" }}>
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
        <List>
          {comments &&
            comments.map(comment => <CommentItem comment={comment} />)}
        </List>
      </CardContent>
    </Card>
  );
};

export default CommentCard;
