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

const DeleteComment = ({ comment }) => {
	const queryClient = useQueryClient();
	const deleteCommentMutation = useMutation(deleteComment, {
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
					</ModalHeader>
					<ModalFooter>
						<Button
							onClick={() => {
								deleteCommentMutation.mutate({
									topic: comment.topic,
									postid: comment.post,
									commentid: comment._id,
								});
							}}
							color="primary"
							mr="2"
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
