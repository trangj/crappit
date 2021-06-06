import React, { useContext } from "react";
import { UserContext } from "../../context/UserState";
import { Heading, Image, Button, Text, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTopicFollow from "../../hooks/topic-query/useTopicFollow";
import Card from "../Utils/Card";

const TopicCard = ({ topic }) => {
	const { user, setUser } = useContext(UserContext);
	const { isLoading, mutate } = useTopicFollow(topic, user, setUser);

	return (
		<Card>
			<Image alt={topic.image_name} src={topic.image_url} maxHeight="200px" />
			<Heading>Welcome to t/{topic.title}!</Heading>
			<Text>{topic.description}</Text>
			<HStack mt="3">
				{user && (
					<Button isLoading={isLoading} onClick={() => mutate(topic.title)}>
						{topic.user_followed_id ? "Unfollow" : "Follow"}
					</Button>
				)}
				<Button as={Link} to={`/t/${topic.title}/submit`}>
					Add Post
				</Button>
				{user && topic.user_moderator_id && (
					<>
						<Button as={Link} to={`/t/${topic.title}/moderation`}>
							Topic Settings
						</Button>
					</>
				)}
			</HStack>
		</Card>
	);
};

export default TopicCard;
