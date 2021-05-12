import React, { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Redirect } from "react-router-dom";
import {
	ModalBody,
	ModalContent,
	ModalHeader,
	Button,
	Modal,
} from "@chakra-ui/react";

const DeletePost = ({ post }) => {
	const { deletePost } = useContext(GlobalContext);
	const [open, setOpen] = useState(false);
	const [redirect, setRedirect] = useState(false);

	if (redirect) return <Redirect to={`/t/${post.topic}`} />;

	return (
		<>
			<Button onClick={() => setOpen(true)}>Delete</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
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
							color="primary"
						>
							Yes, I regret posting it!
						</Button>
						<Button onClick={() => setOpen(false)} color="secondary">
							No, I like my post!
						</Button>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default DeletePost;
