import React from "react";
import PostCard from "../../../../../components/post/PostCard";
import CommentCard from "../../../../../components/comment/CommentCard";
import TopicPostCard from "../../../../../components/topic/TopicPostCard";
import usePost, { fetchPost } from "../../../../../hooks/post-query/usePost";
import useTopic, {
	fetchTopic,
} from "../../../../../hooks/topic-query/useTopic";
import { fetchComments } from "../../../../../hooks/comment-query/useComments";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { PostType } from "src/types/entities/post";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import TopicModeratorCard from "src/components/topic/TopicModeratorCard";
import SideBar from "src/components/post/SideBar";
import TopicBanner from "src/components/topic/TopicBanner";
import TopicRuleCard from "src/components/topic/TopicRuleCard";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const sort = query.sort ? (query.sort as string) : "";
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(["topic", query.topic], () =>
		fetchTopic(query.topic as string)
	);
	await queryClient.prefetchQuery(["post", query.id], () =>
		fetchPost(query.id as string)
	);
	await queryClient.prefetchQuery(["comments", query.id, sort], () =>
		fetchComments(query.id as string, sort)
	);
	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
};

const PostPage = () => {
	const router = useRouter();
	const { id, topic } = router.query;
	const { data } = usePost(id as string);
	const { data: topicData } = useTopic(topic as string);

	if (!data || !topicData) {
		return (
			<div className="fixed inset-y-1/2 w-full text-center">post not found</div>
		);
	}

	return (
		<>
			<Head>
				<title>{`${data.title} : ${data.topic}`}</title>
				<meta
					name="description"
					content={`${data.vote} votes, ${data.number_of_comments} comments. ${
						data.type === PostType.TEXT
							? data.content.split(" ").splice(0, 20).join(" ")
							: topicData.description.split(" ").splice(0, 20).join(" ")
					} ...`}
				/>
				<meta property="og:title" content={`t/${data.topic} - ${data.title}`} />
				<meta
					property="og:type"
					content={data.type === PostType.PHOTO ? "image" : "website"}
				/>
				{data.type === PostType.PHOTO ? (
					<meta
						property="og:image"
						content={`https://crappit.imgix.net/${data.image_name}`}
						key="default"
					/>
				) : null}
				<meta
					property="og:url"
					content={`https://${process.env.NEXT_PUBLIC_DOMAIN_NAME}/t/${topicData?.title}/comments/${data.id}`}
				/>
				<meta
					property="og:description"
					content={`${data.vote} votes and ${data.number_of_comments} comments so far on Crappit`}
				/>
			</Head>
			<div className="mt-12">
				<TopicBanner topic={topicData} />
			</div>
			<div className="mt-4 container mx-auto max-w-5xl sm:px-5">
				<div className="flex gap-6">
					<div className="flex flex-col w-full">
						<PostCard post={data} topic={topicData} />
						<CommentCard post={data} topic={topicData} />
					</div>
					<SideBar>
						<TopicPostCard topicData={topicData} />
						{topicData.rules.length !== 0 && (
							<TopicRuleCard topicData={topicData} />
						)}
						<TopicModeratorCard topicData={topicData} />
					</SideBar>
				</div>
			</div>
		</>
	);
};

export default PostPage;
