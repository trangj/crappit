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
import useDeletePost from "../../hooks/post-query/useDeletePost";

const DeletePost = ({ post }) => {
	const [open, setOpen] = useState(false);
	const { isLoading, mutate } = useDeletePost(post.topic);
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
									postid: post.id,
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
