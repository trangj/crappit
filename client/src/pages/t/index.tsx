import React from "react";
import Link from "next/link";
import useTopics from "../../hooks/topic-query/useTopics";
import { LinkCard, LinkCardOverlay } from "../../ui";
import Head from "next/head";

const AllTopics = () => {
	const { isLoading, data: topics } = useTopics();

	if (isLoading || !topics) return <div>Loading...</div>;

	return (
		<div className="mt-16 container mx-auto max-w-5xl">
			<Head>
				<title>Discover Topics</title>
				<meta name="description" content="View today's top growing Reddit communities. Filter by category to view top communities in sports, gaming, television and more." />
			</Head>
			{topics.map((topic) => (
				<LinkCard key={topic.title} className="p-2">
					<h6>
						<Link passHref href={`t/${topic.title}`}>
							<LinkCardOverlay>
								t/{topic.title}
							</LinkCardOverlay>
						</Link>
					</h6>
					<p>{topic.description}</p>
				</LinkCard>
			))}
		</div>
	);
};

export default AllTopics;
