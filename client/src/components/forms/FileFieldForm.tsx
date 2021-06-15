import React from "react";
import { FormControl, FormErrorMessage, FormLabel } from "@chakra-ui/react";
import { getIn } from "formik";

type Props = {
	field: any,
	form: any,
	setFieldValue: any,
	label: string,
};

const FileFieldForm = ({ field, form, setFieldValue, label, ...props }: Props) => {
	const error = getIn(form.errors, field.name);
	return (
		<FormControl isInvalid={!!error}>
			<FormLabel>{label}</FormLabel>
			<input
				{...props}
				type="file"
				onChange={(e) => setFieldValue("file", e.currentTarget.files ? e.currentTarget.files[0] : null)}
			/>
			<FormErrorMessage>{error}</FormErrorMessage>
		</FormControl>
	);
};

export default FileFieldForm;
