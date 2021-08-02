import React from "react";
import { getIn } from "formik";

type Props = {
	field: any,
	form: any,
	label: string,
	multiline: any;
};

export const TextFieldForm = ({ field, form, multiline, label, ...props }: Props) => {
	const error =
		getIn(form.touched, field.name) && getIn(form.errors, field.name);
	return (
		<>
			<div className="font-medium">{label}</div>
			{!!multiline ? (
				<textarea {...field} {...props} className={`text-input h-32 ${!!error ? 'border-red-500' : 'dark:border-gray-700 border-gray-300'}`} />
			) : (
				<input {...field} {...props} className={`text-input ${!!error ? 'border-red-500' : 'dark:border-gray-700 border-gray-300'}`} />
			)}
			<small className="text-red-500">{error}</small>
		</>
	);
};
