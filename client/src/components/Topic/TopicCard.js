import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState";
import {
	Box,
	Heading,
	Image,
	Button,
	Text,
	HStack,
	useColorModeValue,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTopicFollow from "../../hooks/topic-query/useTopicFollow";
import UpdateTopic from "./UpdateTopic";
import Moderation from "./Moderation";

const TopicCard = ({ topic }) => {
	const { user, setUser } = useContext(UserContext);
	const [openEdit, setOpenEdit] = useState(false);
	const { isLoading, mutate } = useTopicFollow(setUser);

	return (
		<Box
			mb="2"
			borderRadius="lg"
			overflow="hidden"
			backgroundColor={useColorModeValue("white", "gray.700")}
		>
			<Image alt={topic.imageName} src={topic.imageURL} maxHeight="200px" />
			<Box p="3">
				<Heading>Welcome to t/{topic.title}!</Heading>
				{openEdit ? (
					<>
						<UpdateTopic
							topic={topic}
							openEdit={openEdit}
							setOpenEdit={setOpenEdit}
						/>
					</>
				) : (
					<>
						<Text>{topic.description}</Text>
						<HStack mt="3">
							{user && (
								<Button
									isLoading={isLoading}
									onClick={() => mutate(topic.title)}
								>
									{user.followedTopics.includes(topic.title)
										? "Unfollow"
										: "Follow"}
								</Button>
							)}
							<Button as={Link} to={`/t/${topic.title}/submit`}>
								Add Post
							</Button>
							{user &&
								!!topic.moderators.filter(
									(moderator) => moderator._id === user._id
								).length && (
									<>
										<Button onClick={() => setOpenEdit(!openEdit)}>Edit</Button>
										<Moderation topic={topic} />
									</>
								)}
						</HStack>
					</>
				)}
			</Box>
		</Box>
	);
};

export default TopicCard;
