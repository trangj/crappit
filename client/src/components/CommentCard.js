import React, { useContext } from "react";
import CommentItem from "./CommentItem";
import { Card, CardContent, Typography, Button } from "@material-ui/core";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../context/GlobalState";

const schema = yup.object({
  content: yup.string().required()
});

const CommentCard = () => {
  const { user, post, addComment } = useContext(GlobalContext);
  const { comments } = post;

  const handleSubmit = (values, { resetForm }) => {
    const { content } = values;
    const newComment = {
      content
    };
    addComment(post.topic, post._id, newComment);
    resetForm("");
  };

  return (
    <Card style={{ marginBottom: "1rem" }}>
      <CardContent>
        <Typography gutterBottom variant="h6" component="h2">
          Comments
        </Typography>
        {user && (
          <Formik
            initialValues={{ content: "" }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {() => (
              <Form>
                <Field
                  label="Content"
                  name="content"
                  multiline
                  component={TextFieldForm}
                />
                <Button type="submit" style={{ float: "right" }}>
                  Post
                </Button>
              </Form>
            )}
          </Formik>
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
