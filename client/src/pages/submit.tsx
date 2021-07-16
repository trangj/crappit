import React from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../ui/TextFieldForm";
import FileFieldForm from "../ui/FileFieldForm";
import SelectFieldForm from "../ui/SelectFieldForm";
import { Button, Card } from "../ui";
import useTopics from "../hooks/topic-query/useTopics";
import useAddPost from "../hooks/post-query/useAddPost";
import { GetServerSideProps } from "next";
import Head from "next/head";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 10485760;
const schema = yup.object({
	title: yup.string().required("Enter a title for your post"),
	topic: yup.string().required("Select a topic to post to"),
	content: yup.string(),
	link: yup.string().url("Enter a valid URL"),
	file: yup
		.mixed()
		.test("fileSize", "File Size is too large", (value) =>
			value === undefined ? true : value.size <= FILE_SIZE
		)
		.test("fileType", "Unsupported File Format", (value) =>
			value === undefined ? true : SUPPORTED_FORMATS.includes(value.type)
		),
});

interface FormValues {
	title: string,
	content: string,
	link: string,
	file: File | "",
	topic: string;
	type: "text" | "link" | "photo";
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
	if (!req.cookies.token) {
		return {
			redirect: {
				destination: '/login',
				permanent: false
			}
		};
	}
	return {
		props: {}
	};
};

const AddPost = () => {
	const {
		isLoading: topicsIsLoading,
		data: topicsData,
		error: topicsError,
	} = useTopics();
	const { isLoading, mutate } = useAddPost();

	const handleSubmit = ({ title, content, link, file, type, topic }: FormValues) => {
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("content", content ? content : link);
		formData.append("type", type);
		formData.append("topic", topic);
		mutate({ formData });
	};

	const initialValues: FormValues = {
		title: "",
		content: "",
		file: "",
		link: "",
		topic: "",
		type: "text"
	};
	return (
		<div className="mt-16 container mx-auto max-w-5xl">
			<Head>
				<title>Submit to Crappit</title>
			</Head>
			<Card className="p-3 flex flex-col gap-2">
				<h5>Create a post</h5>
				<hr className="border-gray-500" />
				<Formik
					initialValues={initialValues}
					onSubmit={handleSubmit}
					validationSchema={schema}
				>
					{({ setFieldValue, values }) => (
						<Form className="flex flex-col">
							<Field
								label="Topic"
								name="topic"
								component={SelectFieldForm}
								placeholder={
									topicsIsLoading
										? "Loading..."
										: topicsError
											? topicsError.status.text
											: "Choose a topic"
								}
							>
								{!topicsIsLoading && topicsData &&
									topicsData.map((topic) => (
										<option key={topic.title} value={topic.title} className="bg-gray-200 dark:bg-gray-700">
											t/{topic.title}
										</option>
									))}
							</Field>
							<h6>Post Type</h6>
							<div role="group" aria-labelledby="type-group" className="flex justify-evenly mt-2">
								<label>
									Text
									<Field type="radio" id="text_type" name="type" value="text" className="ml-2" />
								</label>
								<label>
									Link
									<Field type="radio" id="link_type" name="type" value="link" className="ml-2" />
								</label>
								<label>
									Photo/GIF
									<Field type="radio" id="photo_type" name="type" value="photo" className="ml-2" />
								</label>
							</div>
							<Field label="Title" name="title" component={TextFieldForm} />
							{values.type === "text" && (
								<Field
									label="Content"
									name="content"
									multiline
									component={TextFieldForm}
								/>
							)}
							{values.type === "link" && (
								<Field label="Link" name="link" component={TextFieldForm} />
							)}
							{values.type === "photo" && (
								<Field
									label="File"
									name="file"
									component={FileFieldForm}
									setFieldValue={setFieldValue}
								/>
							)}
							<Button
								type="submit"
								loading={isLoading}
								disabled={!!!values.title || !!!values.topic}
								className="mt-2 w-20 ml-auto"
								variant="filled"
							>
								Post
							</Button>
						</Form>
					)}
				</Formik>
			</Card>
		</div>
	);
};
export default AddPost;
