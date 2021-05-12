import React from "react";
import { Button } from "@chakra-ui/react";
import { getIn } from "formik";

const FileFieldForm = ({ field, form, setFieldValue, ...props }) => {
	const error = getIn(form.errors, field.name);
	return (
		<>
			<Button component="label">
				Add Image/GIF
				<input
					style={{ display: "none" }}
					type="file"
					onChange={(e) => setFieldValue("file", e.currentTarget.files[0])}
				/>
			</Button>
			{field.value.name}
			<small style={{ color: "red" }}> {error}</small>
		</>
	);
};

export default FileFieldForm;
