import React, { useRef, useState } from "react";
import { Dialog } from '@headlessui/react';
import useDeletePostModerator from "../../hooks/post-query/useDeletePostModerator";
import { Post } from "src/types/entities/post";
import { Button } from "src/ui";

type Props = {
	post: Post;
};

const DeletePostModerator = ({ post }: Props) => {
	const [open, setOpen] = useState(false);
	const { isLoading, mutate } = useDeletePostModerator(post);
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
				<Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
				<div className="flex items-center justify-center min-h-screen">
					<div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-4">
						<Dialog.Title as="h6">
							Delete post?
						</Dialog.Title>
						<Dialog.Description>
							Are you sure you want to delete this post? You can&apos;t undo this.
						</Dialog.Description>
						<div className="flex float-right gap-2">
							<Button onClick={() => setOpen(false)} className="w-20" ref={cancelRef}>
								Cancel
							</Button>
							<Button
								onClick={() => {
									mutate({
										postid: post.id,
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

export default DeletePostModerator;
