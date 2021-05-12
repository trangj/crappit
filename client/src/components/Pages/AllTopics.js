import React, { useEffect, useContext, useState } from "react";
import SkeletonList from "../Utils/SkeletonList";
import { Box, Heading, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { GlobalContext } from "../../context/GlobalState";

const AllTopics = () => {
	const { fetchTopics, topics, loading } = useContext(GlobalContext);
	const [componentLoading, setLoading] = useState(true);

	useEffect(() => {
		fetchTopics();
		setLoading(false);
		// eslint-disable-next-line
	}, []);

	return loading || componentLoading ? (
		<SkeletonList />
	) : (
		<>
			{topics.map((topic) => (
				<Box mb="2" borderWidth="1px" borderRadius="lg" key={topic.title}>
					<Box m="6">
						<Heading>
							<Link to={`/t/${topic.title}`}>/t/{topic.title}</Link>
						</Heading>
						<Text>
							<Link>{topic.description}</Link>
						</Text>
					</Box>
				</Box>
			))}
		</>
	);
};

export default AllTopics;
