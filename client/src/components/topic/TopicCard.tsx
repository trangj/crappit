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
import { useLocation, Link } from "react-router-dom";
import { Topic } from "src/types/entities/topic";

type Props = {
	topic: Topic;
};

const TopicCard = ({ topic }: Props) => {
	const { user } = useContext(UserContext);
	const location = useLocation();
	const { isLoading, mutate } = useTopicFollow(topic);

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
			<Box bg={useColorModeValue("white", "gray.700")} p="4">
				<Box>
					<HStack spacing="6">
						<Heading size="lg">
							{topic.headline ? topic.headline : topic.title}
						</Heading>
						{user ? (
							<Button
								isLoading={isLoading}
								onClick={() => mutate(topic.title)}
								size="md"
							>
								{topic.user_followed_id ? "Unfollow" : "Follow"}
							</Button>
						) : (
							<Button
								size="md"
								as={Link}
								to={{
									pathname: "/login",
									state: {
										status: {
											status: {
												text: "Login to follow topics",
												severity: "error",
											}
										},
										from: location.pathname,
									},
								}}
							>
								Follow
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
