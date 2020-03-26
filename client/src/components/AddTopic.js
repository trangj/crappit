import React, { useState, useContext } from "react";
import { Dialog, DialogTitle, DialogContent, Button } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "./Forms/TextFieldForm";
import FileFieldForm from "./Forms/FileFieldForm";
import { GlobalContext } from "../context/GlobalState";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png"];
const FILE_SIZE = 160 * 1024;
const schema = yup.object({
  title: yup.string().required(),
  description: yup.string().required(),
  file: yup
    .mixed()
    .test("fileSize", "File Size is too large", value =>
      value === undefined ? true : value.size <= FILE_SIZE
    )
    .test("fileType", "Unsupported File Format", value =>
      value === undefined ? true : SUPPORTED_FORMATS.includes(value.type)
    )
});

const AddTopic = () => {
  const [open, setOpen] = useState(false);
  const { addTopic, user } = useContext(GlobalContext);

  const handleSubmit = values => {
    const { title, description, file } = values;
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("file", file);
    addTopic(formData);
    setOpen(false);
  };

  return user ? (
    <>
      <div className="mt-4" onClick={() => setOpen(true)} style={{ flex: 1 }}>
        Create Topic
      </div>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle id="form-dialog-title">Add a topic!</DialogTitle>
        <DialogContent>
          <Formik
            initialValues={{ title: "", description: "", file: "" }}
            onSubmit={handleSubmit}
            validationSchema={schema}
          >
            {({ setFieldValue }) => (
              <Form>
                <Field label="Title" name="title" component={TextFieldForm} />
                <Field
                  label="Description"
                  name="description"
                  multiline
                  component={TextFieldForm}
                />
                <Field
                  label="File"
                  name="file"
                  component={FileFieldForm}
                  setFieldValue={setFieldValue}
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
  ) : null;
};

export default AddTopic;
