import React, { ReactNode } from 'react';
import { FieldProps, getIn } from 'formik';

type Props = FieldProps & {
  label: string,
  placeholder?: ReactNode,
  className?: string,
  children: ReactNode;
};

export function SelectFieldForm({
  field, form, children, label, placeholder, className = '', ...props
}: Props) {
  const error = getIn(form.touched, field.name) && getIn(form.errors, field.name);
  return (
    <>
      <div className="font-medium">{label}</div>
      <select {...field} {...props} className={`select-input ${error ? 'border-red-500' : 'dark:border-gray-700 border-gray-400'} ${className}`}>
        <option value="" selected className="select-option">{placeholder}</option>
        {children}
      </select>
      <small className="text-red-500">{error}</small>
    </>
  );
}
