import React, { useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import { GlobalContext } from "../context/GlobalState";

const schema = yup.object({
  content: yup.string().required()
});

const AddPost = ({ comment }) => {
  const [open, setOpen] = useState(false);

  const { addReply, user } = useContext(GlobalContext);

  const handleSubmit = values => {
    const { content } = values;
    const reply = {
      content
    };
    addReply(comment.topic, comment.post, comment._id, reply);
    setOpen(false);
  };

  return user ? (
    <>
      <Button className="mt-4" onClick={() => setOpen(true)}>
        Reply
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">Add a reply!</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ content: "" }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {({ setFieldValue }) => (
              <Form>
                <Field
                  label="Content"
                  name="content"
                  multiline
                  component={TextFieldForm}
                />
                <Button type="submit" style={{ float: "right" }}>
                  Reply
                </Button>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
    </>
  ) : null;
};

export default AddPost;
