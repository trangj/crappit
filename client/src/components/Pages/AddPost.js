import React, { useState, useContext, useEffect } from "react";
import {
	Button,
	Tabs,
	TabList,
	TabPanels,
	TabPanel,
	Tab,
	Heading,
	Divider,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import TextFieldForm from "../Forms/TextFieldForm";
import FileFieldForm from "../Forms/FileFieldForm";
import SelectFieldForm from "../Forms/SelectFieldForm";
import { GlobalContext } from "../../context/GlobalState";
import { Redirect } from "react-router";

const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const FILE_SIZE = 320 * 1024;
const schema = yup.object({
	title: yup.string().required(),
	topic: yup.string().required(),
	content: yup.string(),
	link: yup.string().url(),
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
	const { topics, fetchTopics, post, addPost } = useContext(GlobalContext);
	const [selectedType, setSelectedType] = useState(0);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		fetchTopics();
		// eslint-disable-next-line
	}, []);

	const handleSubmit = async (values) => {
		const { title, content, link, file, topic } = values;
		const types = ["text", "link", "photo"];
		const formData = new FormData();
		formData.append("file", file);
		formData.append("title", title);
		formData.append("link", link);
		formData.append("content", content);
		formData.append("type", types[selectedType]);
		await addPost(topic, formData);
		setRedirect(true);
	};

	if (redirect) return <Redirect to={`/t/${post.topic}/p/${post._id}`} />;

	return (
		<>
			<Heading>Creat a post</Heading>
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
				{({ setFieldValue }) => (
					<Form>
						<Field
							label="Topic"
							name="topic"
							component={SelectFieldForm}
							mb="2"
						>
							{topics.map((topic) => (
								<option key={topic.title} value={topic.title}>
									t/{topic.title}
								</option>
							))}
						</Field>
						<Tabs
							variant="enclosed"
							isFitted
							index={selectedType}
							onChange={setSelectedType}
						>
							<TabList>
								<Tab>Text</Tab>
								<Tab>Link</Tab>
								<Tab>Photo/GIF</Tab>
							</TabList>
							<TabPanels>
								<TabPanel>
									<Field label="Title" name="title" component={TextFieldForm} />
									<Field
										label="Content"
										name="content"
										multiline
										component={TextFieldForm}
									/>
									<Button type="submit" mt="2">
										Post
									</Button>
								</TabPanel>
								<TabPanel>
									<Field label="Title" name="title" component={TextFieldForm} />
									<Field label="Link" name="link" component={TextFieldForm} />
									<Button type="submit" mt="2">
										Post
									</Button>
								</TabPanel>
								<TabPanel>
									<Field label="Title" name="title" component={TextFieldForm} />
									<Field
										label="File"
										name="file"
										component={FileFieldForm}
										setFieldValue={setFieldValue}
									/>
									<Button type="submit" mt="2">
										Post
									</Button>
								</TabPanel>
							</TabPanels>
						</Tabs>
					</Form>
				)}
			</Formik>
		</>
	);
};
export default AddPost;
