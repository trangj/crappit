import React from "react";
import { useUser } from "../../context/UserState";
import {
	Heading,
	Image,
	Button,
	HStack,
	Box,
	useColorModeValue,
	Text,
} from "@chakra-ui/react";
import useAddTopicFollow from "../../hooks/topic-query/useAddTopicFollow";
import Link from "next/link";
import { Topic } from "src/types/entities/topic";

type Props = {
	topic: Topic;
};

const TopicHeader = ({ topic }: Props) => {
	const { user } = useUser();
	const { isLoading, mutate } = useAddTopicFollow(topic);

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
							<Link passHref href="/login">
								<Button
									size="md"
									as="a"
								>
									Follow
								</Button>
							</Link>
						)}
					</HStack>
					<Text>t/{topic.title}</Text>
				</Box>
			</Box>
		</>
	);
};

export default TopicHeader;
