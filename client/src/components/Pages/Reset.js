import React, { useState, useEffect } from "react";
import { Button } from "@material-ui/core";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import { Formik, Form, Field } from "formik";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";

const schema = yup.object({
  password: yup.string().required(),
  password2: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required(),
});

const Forgot = ({ match }) => {
  const [status, setStatus] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const confirmToken = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/user/reset/${match.params.token}`
        );
        const data = await res.json();
        setStatus(data.status);
        setOpen(true);
      } catch (err) {
        setStatus(err.message);
        setOpen(true);
      }
    };
    confirmToken();
  }, [match.params.token]);

  const handleSubmit = async (values) => {
    const { password, password2 } = values;
    try {
      setStatus("Awaiting response...");
      const res = await fetch(
        `http://localhost:5000/api/user/reset/${match.params.token}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, password2 }),
        }
      );
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
        initialValues={{ password: "", password2: "" }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {() => (
          <Form>
            <Field
              label="Password"
              name="password"
              type="password"
              component={TextFieldForm}
            />
            <Field
              label="Password2"
              name="password2"
              type="password"
              component={TextFieldForm}
            />
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
