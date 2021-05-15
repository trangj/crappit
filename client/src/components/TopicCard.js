import React, { useContext } from "react";
import { GlobalContext } from "../context/GlobalState";
import { Box, Heading, Image, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const TopicCard = () => {
	const { topic, followTopic, user } = useContext(GlobalContext);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image alt={topic.imageName} src={topic.imageURL} />
			<Box m="3">
				<Heading>Welcome to t/{topic.title}!</Heading>
				<Text>{topic.description}</Text>
				<Box mt="3">
					{user && (
						<Button onClick={() => followTopic(topic.title)} mr="2">
							{user.followedTopics.includes(topic.title)
								? "Unfollow"
								: "Follow"}
						</Button>
					)}
					<Button as={Link} to={`/t/${topic.title}/submit`}>
						Add Post
					</Button>
				</Box>
			</Box>
		</Box>
	);
};

export default TopicCard;
