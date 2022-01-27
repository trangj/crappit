import React, { useState } from "react";
import useComments from "../../hooks/comment-query/useComments";
import { Card } from "../../ui/Card";
import { Divider } from "../../ui/Divider";
import { Post } from "src/types/entities/post";
import { Topic } from "src/types/entities/topic";
import { useRouter } from "next/router";
import AddComment from "./AddComment";
import CommentList from "./CommentList";
import SortComment from "./SortComment";

type Props = {
	post: Post;
	topic: Topic;
};

const CommentCard = ({ post, topic }: Props) => {
	const router = useRouter();

	const sort = router.query.sort ? (router.query.sort as string) : "";

	const [sortParam, setSortParam] = useState(sort);
	const { data: comments, isLoading: isCommentsLoading } = useComments(
		String(post.id),
		sortParam
	);

	return (
		<Card id="comments" className="p-3 border-0">
			<div className="mx-6">
				<AddComment post={post} sortParam={sortParam} />
				<SortComment
					post={post}
					topic={topic}
					sortParam={sortParam}
					setSortParam={setSortParam}
				/>
				<Divider className="mb-8 mt-1" />
			</div>
			<CommentList
				isCommentsLoading={isCommentsLoading}
				comments={comments!}
				topic={topic}
			/>
		</Card>
	);
};

export default CommentCard;
