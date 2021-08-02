import React from "react";
import Link from "next/link";
import useTopics, { fetchTopics } from "../../hooks/topic-query/useTopics";
import { Container, LinkCard, LinkCardOverlay } from "../../ui";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { QueryClient } from "react-query";
import { dehydrate } from "react-query/hydration";
import PostSkeleton from "src/components/util/PostSkeleton";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(["topics"], fetchTopics);
	return {
		props: {
			dehydratedState: dehydrate(queryClient)
		}
	};
};

const AllTopics = () => {
	const { isLoading, data: topics } = useTopics();

	return (
		<Container>
			<Head>
				<title>Discover Topics</title>
				<meta name="description" content="View today's top growing Reddit communities. Filter by category to view top communities in sports, gaming, television and more." />
			</Head>
			{!isLoading ? (
				topics?.map((topic) => (
					<LinkCard key={topic.title} className="p-2">
						<h6>
							<Link passHref href={`t/${topic.title}`}>
								<LinkCardOverlay>
									t/{topic.title}
								</LinkCardOverlay>
							</Link>
						</h6>
						<div>{topic.description}</div>
					</LinkCard>
				))
			) : (
				<>
					<PostSkeleton />
					<PostSkeleton />
				</>
			)}
		</Container>
	);
};

export default AllTopics;
