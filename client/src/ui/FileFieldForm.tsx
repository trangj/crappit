import React from 'react';
import { FieldProps, getIn } from 'formik';

type Props = FieldProps & {
  setFieldValue: (field: string, value: any, shouldValidate?: boolean | undefined) => void,
  label: string,
};

export function FileFieldForm({
  field, form, setFieldValue, label, ...props
}: Props) {
  const error = getIn(form.errors, field.name);
  return (
    <>
      <div className="font-medium">{label}</div>
      <input
        {...props}
        type="file"
        onChange={(e) => setFieldValue('file', e.currentTarget.files ? e.currentTarget.files[0] : null)}
        className="mt-2"
      />
      <small className="text-red-500">{error}</small>
    </>
  );
}
