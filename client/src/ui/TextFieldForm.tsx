import React from "react";
import { getIn } from "formik";

type Props = {
	field: any,
	form: any,
	label: string,
	multiline: any;
};

const TextFieldForm = ({ field, form, multiline, label, ...props }: Props) => {
	const error =
		getIn(form.touched, field.name) && getIn(form.errors, field.name);
	return (
		<>
			<h6>{label}</h6>
			{!!multiline ? (
				<textarea {...field} {...props} className={`w-full py-2 px-4 mt-2 bg-transparent border rounded ${!!error ? 'border-red-500' : 'border-gray-700'}`} />
			) : (
				<input {...field} {...props} className={`w-full py-2 px-4 mt-2 bg-transparent border rounded ${!!error ? 'border-red-500' : 'border-gray-700'}`} />
			)}
			<small className="text-red-500">{error}</small>
		</>
	);
};

export default TextFieldForm;
