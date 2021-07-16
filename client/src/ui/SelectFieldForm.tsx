import React, { ReactNode } from "react";
import { getIn } from "formik";

type Props = {
	field: any,
	form: any,
	label: string,
	placeholder?: ReactNode,
	children: ReactNode;
};

const SelectFieldForm = ({ field, form, children, label, placeholder, ...props }: Props) => {
	const error =
		getIn(form.touched, field.name) && getIn(form.errors, field.name);
	return (
		<>
			<h6>{label}</h6>
			<select {...field} {...props} className={`w-full p-2 mt-2 bg-transparent border rounded ${!!error ? 'border-red-500' : 'border-gray-700'}`}>
				<option value="" selected className="bg-gray-200 dark:bg-gray-700">{placeholder}</option>
				{children}
			</select>
			<small className="text-red-500">{error}</small>
		</>
	);
};

export default SelectFieldForm;
