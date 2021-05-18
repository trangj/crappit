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
import AlertStatus from "../Utils/AlertStatus";
import useDeletePost from "../../hooks/post-query/useDeletePost";

const DeletePost = ({ post }) => {
	const [open, setOpen] = useState(false);
	const { isError, isLoading, error, mutate } = useDeletePost(post);
	const cancelRef = useRef();

	return (
		<>
			<Button size="sm" onClick={() => setOpen(true)} variant="ghost">
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
						Delete post?
						{isError && <AlertStatus status={error} />}
					</AlertDialogHeader>
					<AlertDialogBody>
						Are you sure you want to delete your post? You can't undo this.
					</AlertDialogBody>
					<AlertDialogFooter>
						<Button onClick={() => setOpen(false)} mr="2" ref={cancelRef}>
							Cancel
						</Button>
						<Button
							onClick={() => {
								mutate({
									topic: post.topic,
									postid: post._id,
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

export default DeletePost;