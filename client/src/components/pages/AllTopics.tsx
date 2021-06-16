import React from "react";
import SkeletonList from "../utils/SkeletonList";
import AlertStatus from "../utils/AlertStatus";
import { Container, Heading, LinkOverlay, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTopics from "../../hooks/topic-query/useTopics";
import LinkCard from "../utils/LinkCard";

const AllTopics = () => {
	const { isLoading, isError, data: topics, error } = useTopics();

	if (isError || error) return <AlertStatus status={error} />;
	if (isLoading || !topics) return <SkeletonList />;

	return (
		<Container>
			{topics.map((topic) => (
				<LinkCard key={topic.title} borderRadius="md" mb="3">
					<Heading>
						<LinkOverlay as={Link} to={`t/${topic.title}`}>
							t/{topic.title}
						</LinkOverlay>
					</Heading>
					<Text>{topic.description}</Text>
				</LinkCard>
			))}
		</Container>
	);
};

export default AllTopics;