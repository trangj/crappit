import React from "react";
import Link from "next/link";
import useTopics from "../../hooks/topic-query/useTopics";
import { LinkCard } from "../../ui";
import Head from "next/head";

const AllTopics = () => {
	const { isLoading, data: topics } = useTopics();

	if (isLoading || !topics) return <div>Loading...</div>;

	return (
		<div className="mt-16 container mx-auto max-w-5xl">
			<Head>
				<title>All Topics</title>
			</Head>
			{topics.map((topic) => (
				<LinkCard key={topic.title} className="p-2">
					<h6>
						<Link passHref href={`t/${topic.title}`}>
							<a>
								t/{topic.title}
							</a>
						</Link>
					</h6>
					<p>{topic.description}</p>
				</LinkCard>
			))}
		</div>
	);
};

export default AllTopics;
