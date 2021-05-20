import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	Button,
	Text,
	Heading,
} from "@chakra-ui/react";
import useAddModerator from "../../hooks/topic-query/useAddModerator";
import AlertStatus from "../Utils/AlertStatus";
import TextFieldForm from "../Forms/TextFieldForm";
import { Link } from "react-router-dom";

const schema = yup.object({
	username: yup.string().required(),
});

const Moderation = ({ topic }) => {
	const [open, setOpen] = useState(false);
	const { isLoading, isError, isSuccess, data, error, mutate } =
		useAddModerator(topic);

	const handleSubmit = ({ username }) => {
		mutate({
			topic: topic.title,
			username,
		});
	};

	return (
		<>
			<Button onClick={() => setOpen(true)}>Moderation</Button>
			<Modal isOpen={open}>
				<ModalOverlay />
				<Formik
					initialValues={{ username: "" }}
					onSubmit={handleSubmit}
					validationSchema={schema}
				>
					{() => (
						<Form>
							<ModalContent>
								<ModalHeader>Moderation</ModalHeader>
								<ModalBody>
									<Heading size="sm">Current Moderators</Heading>
									{topic.moderators.map((moderator) => (
										<Text key={moderator._id}>
											<Link to={`/user/${moderator._id}`}>
												u/{moderator.username}
											</Link>
										</Text>
									))}
									<Field
										label="Add Moderator"
										name="username"
										component={TextFieldForm}
									/>
									{isError && <AlertStatus status={error} />}
									{isSuccess && <AlertStatus status={data} />}
								</ModalBody>
								<ModalFooter>
									<Button onClick={() => setOpen(false)} mr="2">
										Close
									</Button>
									<Button type="submit" isLoading={isLoading}>
										Add Moderator
									</Button>
								</ModalFooter>
							</ModalContent>
						</Form>
					)}
				</Formik>
			</Modal>
		</>
	);
};

export default Moderation;
