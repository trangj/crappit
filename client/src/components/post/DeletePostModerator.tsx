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
import useDeletePostModerator from "../../hooks/post-query/useDeletePostModerator";
import { Post } from "src/types/entities/post";

type Props = {
	post: Post;
};

const DeletePostModerator = ({ post }: Props) => {
	const [open, setOpen] = useState(false);
	const { isLoading, mutate } = useDeletePostModerator(post);
	const cancelRef = useRef(null);

	return (
		<>
			<Button size="sm" onClick={() => setOpen(true)} variant="ghost">
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
						Delete post?
					</AlertDialogHeader>
					<AlertDialogBody>
						Are you sure you want to delete this post? You can&apos;t undo this.
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

export default DeletePostModerator;
