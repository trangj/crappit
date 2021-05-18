import React from "react";
import SkeletonList from "../Utils/SkeletonList";
import AlertStatus from "../Utils/AlertStatus";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTopics from "../../hooks/topic-query/useTopics";

const AllTopics = () => {
	const { isLoading, isError, data: topics, error } = useTopics();

	if (isLoading) return <SkeletonList />;
	if (isError) return <AlertStatus status={error} />;

	return isLoading ? (
		<SkeletonList />
	) : (
		<>
			{topics.map((topic) => (
				<Box mb="2" borderWidth="1px" borderRadius="lg" key={topic.title}>
					<Box m="3">
						<Heading>
							<Link to={`t/${topic.title}`}>t/{topic.title}</Link>
						</Heading>
						<Text>{topic.description}</Text>
					</Box>
				</Box>
			))}
		</>
	);
};

export default AllTopics;
