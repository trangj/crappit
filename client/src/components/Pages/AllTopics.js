import React from "react";
import SkeletonList from "../Utils/SkeletonList";
import AlertStatus from "../Utils/AlertStatus";
import { Container, Heading, LinkOverlay, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTopics from "../../hooks/topic-query/useTopics";
import LinkCard from "../Utils/LinkCard";

const AllTopics = () => {
	const { isLoading, isError, data: topics, error } = useTopics();

	if (isLoading) return <SkeletonList />;
	if (isError) return <AlertStatus status={error} />;

	return (
		<Container mt="2" maxW="container.md">
			{isLoading ? (
				<SkeletonList />
			) : (
				<>
					{topics.map((topic) => (
						<LinkCard key={topic.title}>
							<Heading>
								<LinkOverlay as={Link} to={`t/${topic.title}`}>
									t/{topic.title}
								</LinkOverlay>
							</Heading>
							<Text>{topic.description}</Text>
						</LinkCard>
					))}
				</>
			)}
		</Container>
	);
};

export default AllTopics;
