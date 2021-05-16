import React, { useState } from "react";
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Button,
	ModalFooter,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "react-query";
import { deleteComment } from "../query/comment-query";
import AlertStatus from "./Utils/AlertStatus";

const DeleteComment = ({ comment }) => {
	const queryClient = useQueryClient();
	const { isError, isLoading, error, mutate } = useMutation(deleteComment, {
		onSuccess: (res) => {
			queryClient.invalidateQueries(["post", res.comment.post]);
			setOpen(false);
		},
	});
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button size="xs" onClick={() => setOpen(true)}>
				Delete
			</Button>
			<Modal isOpen={open} onClose={() => setOpen(false)} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader id="form-dialog-title">
						Are you sure you want to delete this comment?
						{isError && <AlertStatus status={error} />}
					</ModalHeader>
					<ModalFooter>
						<Button
							onClick={() => {
								mutate({
									topic: comment.topic,
									postid: comment.post,
									commentid: comment._id,
								});
							}}
							color="primary"
							mr="2"
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

export default DeleteComment;
