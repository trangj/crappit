import React, { useContext, useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import { GlobalContext } from "../context/GlobalState";

const schema = yup.object({
  content: yup.string().required()
});

const UpdateComment = ({ comment }) => {
  const [open, setOpen] = useState(false);
  const { updateComment, post } = useContext(GlobalContext);

  const handleSubmit = values => {
    const { content } = values;
    const newComment = {
      content
    };
    updateComment(post.topic, post._id, comment._id, newComment);
    setOpen(false);
  };

  return (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Edit
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">Edit</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ content: comment.content }}
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
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UpdateComment;
