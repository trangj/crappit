import React from "react";
import PostCard from "../../../../../components/post/PostCard";
import CommentCard from "../../../../../components/comment/CommentCard";
import SkeletonCard from "../../../../../components/utils/SkeletonCard";
import TopicPostCard from "../../../../../components/topic/TopicPostCard";
import usePost, { fetchPost } from "../../../../../hooks/post-query/usePost";
import useTopic, { fetchTopic } from "../../../../../hooks/topic-query/useTopic";
import { fetchComments } from "../../../../../hooks/comment-query/useComments";
import { Container } from "@chakra-ui/layout";
import { useRouter } from "next/router";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { PostType } from "src/types/entities/post";
import { Box, Flex } from "@chakra-ui/react";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const sort = query.sort ? query.sort as string : "";
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string));
	await queryClient.prefetchQuery(['post', query.id], () => fetchPost(query.id as string));
	await queryClient.prefetchQuery(['comments', query.id, sort], () => fetchComments(query.id as string, sort));
	return {
		props: {
			dehydratedState: dehydrate(queryClient)
		}
	};
};

const PostPage = () => {
	const router = useRouter();
	const { id, topic } = router.query;
	const {
		data
	} = usePost(id as string);
	const {
		data: topicData,
	} = useTopic(topic as string);

	if (!data || !topicData) return <SkeletonCard />;

	return (
		<>
			<Head>
				<title>{data.title} : {data.topic}</title>
				<meta name="description" content={`${data.vote} votes, ${data.number_of_comments} comments. ${data.type === PostType.TEXT ? data.content.slice(0, 155) + ' ...' : topicData.description.slice(0, 155)}`} />
				<meta property="og:title" content={`${data.title} : ${data.topic}`} />
				<meta property="og:type" content={data.type === PostType.PHOTO ? 'image' : 'website'} />
				<meta property="og:url" content={`https://crappit.me/t/${topicData?.title}/comments/${data.id}`} />
				<meta property="twitter:title" content={`${data.title} : ${data.topic}`} />
			</Head>
			<Container maxW="container.lg">
				<Flex flexDirection="row">
					<Flex flexDirection="column" width="100%">
						<PostCard post={data} topic={topicData} />
						<CommentCard post={data} topic={topicData} />
					</Flex>
					<Flex
						flexDirection="column"
						width="312px"
						ml="5"
						display={{ base: "none", lg: "block" }}
					>
						<Box width="inherit">
							<TopicPostCard topicData={topicData} />
						</Box>
					</Flex>
				</Flex>
			</Container>
		</>
	);
};

export default PostPage;
