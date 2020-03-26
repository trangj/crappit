import React from "react";
import { getIn } from "formik";
import { TextField } from "@material-ui/core";

const TextFieldForm = ({ field, form, multiline, ...props }) => {
  const error =
    getIn(form.touched, field.name) && getIn(form.errors, field.name);
  return (
    <TextField
      fullWidth
      helperText={error}
      multiline={!!multiline}
      rows="4"
      error={!!error}
      {...field}
      {...props}
    />
  );
};

export default TextFieldForm;
