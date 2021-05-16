import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
	ModalContent,
	ModalHeader,
	Button,
	Modal,
	ModalOverlay,
	ModalFooter,
} from "@chakra-ui/react";
import { useMutation } from "react-query";
import { deletePost } from "../query/post-query";
import AlertStatus from "./Utils/AlertStatus";

const DeletePost = ({ post }) => {
	const [open, setOpen] = useState(false);
	const history = useHistory();
	const { isError, isLoading, error, mutate } = useMutation(deletePost, {
		onSuccess: (res) => {
			history.push(`/t/${post.topic}`);
		},
	});

	return (
		<>
			<Button size="sm" onClick={() => setOpen(true)}>
				Delete
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader id="form-dialog-title">
						Are you sure you want to delete this post?
						{isError && <AlertStatus status={error} />}
					</ModalHeader>
					<ModalFooter>
						<Button
							onClick={() => {
								mutate({
									topic: post.topic,
									postid: post._id,
								});
							}}
							mr="2"
							color="primary"
							isLoading={isLoading}
						>
							Yes
						</Button>
						<Button onClick={() => setOpen(false)} color="secondary">
							No
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeletePost;
