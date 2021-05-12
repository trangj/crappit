import React, { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalOverlay,
	Button,
} from "@chakra-ui/react";

const DeleteComment = ({ comment }) => {
	const { deleteComment } = useContext(GlobalContext);
	const [open, setOpen] = useState(false);
	return (
		<>
			<Button size="xs" onClick={() => setOpen(true)}>
				Delete
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader id="form-dialog-title">
						Are you sure you want to delete this comment?
					</ModalHeader>
					<ModalBody>
						<Button
							onClick={() => {
								deleteComment(comment.topic, comment.post, comment._id);
								setOpen(false);
							}}
							color="primary"
							mr="2"
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

export default DeleteComment;
