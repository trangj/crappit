import React, { useState } from "react";
import {
	Button,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	Tab,
	Heading,
	Divider,
	Container,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../components/forms/TextFieldForm";
import FileFieldForm from "../components/forms/FileFieldForm";
import SelectFieldForm from "../components/forms/SelectFieldForm";
import useTopics from "../hooks/topic-query/useTopics";
import useAddPost from "../hooks/post-query/useAddPost";
import Card from "../components/utils/Card";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 512 * 1024;
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

const AddPost = ({ match }) => {
	const {
		isLoading: topicsIsLoading,
		isError: topicsIsError,
		data: topicsData,
		error: topicsError,
	} = useTopics();
	const { isLoading, mutate } = useAddPost();
	const [selectedType, setSelectedType] = useState(0);

	const handleSubmit = ({ title, content, link, file, topic }) => {
		const types = ["text", "link", "photo"];
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("content", content ? content : link);
		formData.append("type", types[selectedType]);
		formData.append("topic", topic);
		mutate({ formData });
	};

	return (
		<Container>
			<Card>
				<Heading>Create a post</Heading>
				<Divider my="3" />
				<Formik
					initialValues={{
						title: "",
						content: "",
						file: "",
						link: "",
						topic: match.params.topic,
					}}
					onSubmit={handleSubmit}
					validationSchema={schema}
				>
					{({ setFieldValue, values }) => (
						<Form>
							<Field
								label={"Topic"}
								name="topic"
								component={SelectFieldForm}
								placeholder={
									topicsIsLoading
										? "Loading..."
										: topicsIsError
										? topicsError.status.text
										: "Choose a topic"
								}
								mb="2"
							>
								{!topicsIsLoading &&
									topicsData.map((topic) => (
										<option key={topic.title} value={topic.title}>
											t/{topic.title}
										</option>
									))}
							</Field>
							<Tabs
								variant="soft-rounded"
								isFitted
								index={selectedType}
								onChange={setSelectedType}
								mt="5"
							>
								<TabList mb="3">
									<Tab>Text</Tab>
									<Tab>Link</Tab>
									<Tab>Photo/GIF</Tab>
								</TabList>
								<Field label="Title" name="title" component={TextFieldForm} />
								<TabPanels>
									<TabPanel p="0">
										<Field
											label="Content"
											name="content"
											multiline
											component={TextFieldForm}
										/>
									</TabPanel>
									<TabPanel p="0">
										<Field label="Link" name="link" component={TextFieldForm} />
									</TabPanel>
									<TabPanel p="0">
										<Field
											label="File"
											name="file"
											component={FileFieldForm}
											setFieldValue={setFieldValue}
										/>
									</TabPanel>
								</TabPanels>
								<Button
									type="submit"
									mt="2"
									isLoading={isLoading}
									isDisabled={!!!values.title || !!!values.topic}
								>
									Post
								</Button>
							</Tabs>
						</Form>
					)}
				</Formik>
			</Card>
		</Container>
	);
};
export default AddPost;
