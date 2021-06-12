import React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { getIn } from "formik";

const FileFieldForm = ({ field, form, setFieldValue, label, ...props }) => {
	const error = getIn(form.errors, field.name);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel>{label}</FormLabel>
			<input
				type="file"
				onChange={(e) => setFieldValue("file", e.currentTarget.files[0])}
			/>
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	);
};

export default FileFieldForm;
