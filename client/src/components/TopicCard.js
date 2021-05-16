import React, { useContext } from "react";
import { UserContext } from "../context/GlobalState";
import { Box, Heading, Image, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { followTopic } from "../query/topic-query";

const TopicCard = ({ topic }) => {
	const { user } = useContext(UserContext);
	const followTopicMutation = useMutation(followTopic, {
		onSuccess: (res) => {
			user.followedTopics = res.data.user.followedTopics;
		},
	});

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image alt={topic.imageName} src={topic.imageURL} />
			<Box m="3">
				<Heading>Welcome to t/{topic.title}!</Heading>
				<Text>{topic.description}</Text>
				<Box mt="3">
					{user && (
						<Button
							onClick={() => followTopicMutation.mutate(topic.title)}
							mr="2"
						>
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
