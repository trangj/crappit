import React from "react";
import { getIn } from "formik";
import {
	FormLabel,
	Input,
	Textarea,
	FormErrorMessage,
	FormControl,
} from "@chakra-ui/react";

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
		<FormControl isInvalid={!!error}>
			<FormLabel>{label}</FormLabel>
			{!!multiline ? (
				<Textarea {...field} {...props} />
			) : (
				<Input {...field} {...props} />
			)}
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	);
};

export default TextFieldForm;
