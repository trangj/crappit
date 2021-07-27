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
			<p className="font-medium">{label}</p>
			<select {...field} {...props} className={`select-input ${!!error ? 'border-red-500' : 'dark:border-gray-700 border-gray-400'}`}>
				<option value="" selected className="select-option">{placeholder}</option>
				{children}
			</select>
			<small className="text-red-500">{error}</small>
		</>
	);
};

export default SelectFieldForm;
