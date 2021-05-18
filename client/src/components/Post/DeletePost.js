import React, { useState } from "react";
import {
	ModalContent,
	ModalHeader,
	Button,
	Modal,
	ModalOverlay,
	ModalFooter,
} from "@chakra-ui/react";
import AlertStatus from "../Utils/AlertStatus";
import useDeletePost from "../../hooks/post-query/useDeletePost";

const DeletePost = ({ post }) => {
	const [open, setOpen] = useState(false);
	const { isError, isLoading, error, mutate } = useDeletePost(post);

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
