import React, { useRef, useState } from "react";
import {
	AlertDialog,
	AlertDialogBody,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogContent,
	AlertDialogOverlay,
	Button,
} from "@chakra-ui/react";
import useDeleteComment from "../../hooks/comment-query/useDeleteComment";
import AlertStatus from "../Utils/AlertStatus";

const DeleteComment = ({ comment }) => {
	const [open, setOpen] = useState(false);
	const { isError, isLoading, error, mutate } = useDeleteComment(
		setOpen,
		comment
	);
	const cancelRef = useRef();

	return (
		<>
			<Button size="xs" onClick={() => setOpen(true)} variant="ghost">
				Delete
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
						{isError && <AlertStatus status={error} />}
					</AlertDialogHeader>
					<AlertDialogBody>
						Are you sure you want to delete your comment? You can't undo this.
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button onClick={() => setOpen(false)} mr="2" ref={cancelRef}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								mutate({
									topic: comment.topic,
									postid: comment.post,
									commentid: comment._id,
								});
							}}
							colorScheme="red"
							isLoading={isLoading}
						>
							Delete
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
};

export default DeleteComment;
