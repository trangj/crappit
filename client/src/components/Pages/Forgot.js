import React, { useState } from "react";
import { Button } from "@material-ui/core";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const schema = yup.object({
  email: yup.string().email().required(),
});

const Forgot = () => {
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (values) => {
    const { email } = values;
    try {
      setStatus("Awaiting response...");
      const res = await fetch("http://localhost:5000/api/user/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setStatus(data.status);
      setOpen(true);
    } catch (err) {
      setStatus(err.message);
      setOpen(true);
    }
  };

  return (
    <>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {() => (
          <Form>
            <h3>
              Forgot your password? Enter your email to change your password.
            </h3>
            <Field label="Email" name="email" component={TextFieldForm} />
            <Button type="submit" style={{ float: "right" }}>
              Post
            </Button>
          </Form>
        )}
      </Formik>
      {status && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={() => setOpen(false)}
        >
          <Alert onClose={() => setOpen(false)}>{status}</Alert>
        </Snackbar>
      )}
    </>
  );
};

export default Forgot;
