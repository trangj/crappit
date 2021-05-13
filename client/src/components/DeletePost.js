import React, { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Redirect } from "react-router-dom";
import {
	ModalBody,
	ModalContent,
	ModalHeader,
	Button,
	Modal,
	ModalOverlay,
} from "@chakra-ui/react";

const DeletePost = ({ post }) => {
	const { deletePost } = useContext(GlobalContext);
	const [open, setOpen] = useState(false);
	const [redirect, setRedirect] = useState(false);

	if (redirect) return <Redirect to={`/t/${post.topic}`} />;

	return (
		<>
			<Button size="sm" onClick={() => setOpen(true)}>
				Delete
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader id="form-dialog-title">
						Are you sure you want to delete this post?
					</ModalHeader>
					<ModalBody>
						<Button
							onClick={() => {
								deletePost(post.topic, post._id);
								setRedirect(true);
							}}
							mr="2"
							color="primary"
						>
							Yes
						</Button>
						<Button onClick={() => setOpen(false)} color="secondary">
							No
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeletePost;
