import React from "react";
import { getIn } from "formik";
import {
	FormLabel,
	Select,
	FormErrorMessage,
	FormControl,
} from "@chakra-ui/react";

const SelectFieldForm = ({ field, form, children, label, ...props }) => {
	const error =
		getIn(form.touched, field.name) && getIn(form.errors, field.name);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel>{label}</FormLabel>
			<Select {...field} {...props}>
				{children}
			</Select>
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	);
};

export default SelectFieldForm;
