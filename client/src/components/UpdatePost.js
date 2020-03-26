import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";

const schema = yup.object({
  title: yup.string().required(),
  content: yup.string().required()
});

const UpdatePost = ({ updatePost, post }) => {
  const [open, setOpen] = useState(false);

  const handleSubmit = values => {
    const { title, content } = values;
    const newPost = {
      title,
      content
    };
    updatePost(post.topic, post._id, newPost);
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
            initialValues={{ title: post.title, content: post.content }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {() => (
              <Form>
                <Field label="Title" name="title" component={TextFieldForm} />
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

export default UpdatePost;
