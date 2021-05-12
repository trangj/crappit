import React from "react";
import { getIn } from "formik";
import {
	FormLabel,
	Input,
	Textarea,
	FormErrorMessage,
	FormControl,
} from "@chakra-ui/react";

const TextFieldForm = ({ field, form, multiline, label, ...props }) => {
	const error =
		getIn(form.touched, field.name) && getIn(form.errors, field.name);
	return (
		<FormControl isInvalid={!!error}>
			{!!multiline ? (
				<>
					<FormLabel>{label}</FormLabel>
					<Textarea isFullWidth {...field} {...props} />
					<FormErrorMessage>{error}</FormErrorMessage>
				</>
			) : (
				<>
					<FormLabel>{label}</FormLabel>
					<Input isFullWidth {...field} {...props} />
					<FormErrorMessage>{error}</FormErrorMessage>
				</>
			)}
		</FormControl>
	);
};

export default TextFieldForm;
