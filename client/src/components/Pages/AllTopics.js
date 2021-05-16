import React from "react";
import SkeletonList from "../Utils/SkeletonList";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import { fetchTopics } from "../../query/topic-query";

const AllTopics = () => {
	const { isLoading, isError, data, error } = useQuery(["topics"], fetchTopics);
	const topics = data;

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
