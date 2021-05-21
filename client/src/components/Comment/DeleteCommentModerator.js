import React, { useState, useRef } from "react";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
} from "@chakra-ui/react";
import useDeleteCommentModerator from "../../hooks/comment-query/useDeleteCommentModerator";

const DeleteCommentModerator = ({ comment }) => {
	const [open, setOpen] = useState(false);
	const { isLoading, mutate } = useDeleteCommentModerator(setOpen);
	const cancelRef = useRef();

	return (
		<>
			<Button size="xs" onClick={() => setOpen(true)} variant="ghost">
				Delete as Moderator
			</Button>
			<AlertDialog
				isOpen={open}
				onClose={() => setOpen(false)}
				isCentered
				leastDestructiveRef={cancelRef}
			>
				<AlertDialogOverlay />
				<AlertDialogContent>
					<AlertDialogHeader id="form-dialog-title">
						Delete comment?
					</AlertDialogHeader>
					<AlertDialogBody>
						Are you sure you want to delete this post? You can't undo this.
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button onClick={() => setOpen(false)} mr="2" ref={cancelRef}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								mutate({
									commentId: comment._id,
								});
							}}
							isLoading={isLoading}
							colorScheme="red"
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default DeleteCommentModerator;
