import React, { useContext, useState } from "react";
import { ListItem, ListItemText } from "@material-ui/core";
import DeleteComment from "./DeleteComment";
import UpdateComment from "./UpdateComment";
import AddReply from "./AddReply";
import CommentVoting from "./CommentVoting";
import { Link } from "react-router-dom";
import moment from "moment";
import { GlobalContext } from "../context/GlobalState";

const CommentItem = ({ comment }) => {
  const { user } = useContext(GlobalContext);
  const [hideComments, setHideComments] = useState(false);

  return (
    <>
      <ListItem>
        <CommentVoting comment={comment} />
        <ListItemText
          primary={comment.content}
          secondary={
            <>
              Commented by
              <Link to={`/u/${comment.authorId}`}>
                {" "}
                {comment.author}{" "}
              </Link> | {moment(comment.date).fromNow()}
            </>
          }
        />
        {user !== undefined ? (
          <>
            <AddReply comment={comment} />
            {user._id === comment.authorId && (
              <>
                <DeleteComment comment={comment} />
                <UpdateComment comment={comment} />
              </>
            )}
          </>
        ) : null}
      </ListItem>
      {
        !hideComments ? (
          <div style={{display: 'flex', flexDirection: 'row'}}>
            <div class="thread" onClick={() => setHideComments(true)}>
            </div>
            <div style={{ marginLeft: "1rem" }}>
              {comment.comments
                ? comment.comments.map((comment) => (
                    <CommentItem comment={comment} key={comment._id} />
                  ))
                : null}
            </div>
          </div>
        ) : (
          <a class="showComments" style={{marginLeft: "1rem"}} onClick={() => setHideComments(false)}> 
            Show Comments({comment.comments.length})
          </a>
        )
      }
    </>
  );
};

export default CommentItem;
