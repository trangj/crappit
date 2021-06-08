import React, { useContext } from "react";
import { UserContext } from "../../context/UserState";
import {
	Heading,
	Image,
	Button,
	HStack,
	Box,
	useColorModeValue,
} from "@chakra-ui/react";
import useTopicFollow from "../../hooks/topic-query/useTopicFollow";

const TopicCard = ({ topic }) => {
	const { user } = useContext(UserContext);
	const { isLoading, mutate } = useTopicFollow(topic);

	console.log(topic);

	return (
		<>
			{topic.image_url ? (
				<Image
					alt={topic.image_name}
					src={topic.image_url}
					maxHeight="200px"
					width="100%"
				/>
			) : (
				<Box width="100%" height="100px" bg="blue.200" />
			)}
			<HStack bg={useColorModeValue("gray.50", "gray.700")} height="80px" p="4">
				<Heading>t/{topic.title}</Heading>
				{user && (
					<Button
						isLoading={isLoading}
						onClick={() => mutate(topic.title)}
						size="sm"
					>
						{topic.user_followed_id ? "Unfollow" : "Follow"}
					</Button>
				)}
			</HStack>
		</>
	);
};

export default TopicCard;
