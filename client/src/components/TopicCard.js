import React, { useContext, useState } from "react";
import AddPost from "./AddPost";
import { GlobalContext } from "../context/GlobalState";
import { Box, Heading, Image, Button, Text } from "@chakra-ui/react";

const TopicCard = () => {
	const { topic, followTopic, user } = useContext(GlobalContext);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image alt={topic.imageName} src={topic.imageURL} />
			<Box m="4">
				<Heading>Welcome to t/{topic.title}!</Heading>
				<Text>{topic.description}</Text>
				<Box mt="2">
					{user && (
						<Button onClick={() => followTopic(topic.title)} mr="2">
							{user.followedTopics.includes(topic.title)
								? "Unfollow"
								: "Follow"}
						</Button>
					)}
					<AddPost />
				</Box>
			</Box>
		</Box>
	);
};

export default TopicCard;
