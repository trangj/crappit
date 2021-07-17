import React, { useRef, useState } from "react";
import { Dialog } from "@headlessui/react";
import useDeleteCommentModerator from "../../hooks/comment-query/useDeleteCommentModerator";
import { Comment } from "src/types/entities/comment";
import { Button } from "src/ui";

type Props = {
	comment: Comment;
};

const DeleteCommentModerator = ({ comment }: Props) => {
	const [open, setOpen] = useState(false);
	const { isLoading, mutate } = useDeleteCommentModerator(comment, setOpen);
	const cancelRef = useRef(null);

	return (
		<>
			<Button onClick={() => setOpen(true)} variant="ghost" border="rounded" className="text-xs">
				Remove
			</Button>
			<Dialog
				as="div"
				className="fixed inset-0 z-10 overflow-y-auto"
				open={open}
				onClose={() => setOpen(false)}
				initialFocus={cancelRef}
			>
				<Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />
				<div className="flex items-center justify-center min-h-screen">
					<div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-4">
						<Dialog.Title as="h6">
							Delete comment?
						</Dialog.Title>
						<Dialog.Description>
							Are you sure you want to delete this comment? You can&apos;t undo this.
						</Dialog.Description>
						<div className="flex justify-end gap-2">
							<Button onClick={() => setOpen(false)} ref={cancelRef}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									mutate({
										commentId: comment.id,
									});
								}}
								loading={isLoading}
								variant="filled"
								className="w-20"
							>
								Delete
							</Button>
						</div>
					</div>
				</div>
			</Dialog>
		</>
	);
};

export default DeleteCommentModerator;
