import React, { useContext } from "react";
import { UserContext } from "../../context/UserState";
import {
	Heading,
	Image,
	Button,
	HStack,
	Box,
	useColorModeValue,
	Text,
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
				<Box width="100%" height="100px" bg="blue.100" />
			)}
			<Box bg={useColorModeValue("gray.50", "gray.700")} p="4">
				<Box>
					<HStack spacing="6">
						<Heading size="lg">
							{topic.headline ? topic.headline : topic.title}
						</Heading>
						{user && (
							<Button
								isLoading={isLoading}
								onClick={() => mutate(topic.title)}
								size="md"
							>
								{topic.user_followed_id ? "Unfollow" : "Follow"}
							</Button>
						)}
					</HStack>
					<Text>t/{topic.title}</Text>
				</Box>
			</Box>
		</>
	);
};

export default TopicCard;
