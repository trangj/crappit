import React, { useContext } from "react";
import { UserContext } from "../context/UserState";
import { Box, Heading, Image, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { followTopic } from "../query/topic-query";
import AlertStatus from "./Utils/AlertStatus";

const TopicCard = ({ topic }) => {
	const { user, setUser } = useContext(UserContext);
	const { isError, isLoading, error, mutate } = useMutation(followTopic, {
		onSuccess: (res) => {
			setUser(res.user);
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
							isLoading={isLoading}
							onClick={() => mutate(topic.title)}
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
					{isError && <AlertStatus status={error} />}
				</Box>
			</Box>
		</Box>
	);
};

export default TopicCard;
