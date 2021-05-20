import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState";
import { Box, Heading, Image, Button, Text, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTopicFollow from "../../hooks/topic-query/useTopicFollow";
import AlertStatus from "../Utils/AlertStatus";
import UpdateTopic from "./UpdateTopic";
import Moderation from "./Moderation";

const TopicCard = ({ topic }) => {
	const { user, setUser } = useContext(UserContext);
	const [openEdit, setOpenEdit] = useState(false);
	const { isError, isLoading, error, mutate } = useTopicFollow(setUser);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image alt={topic.imageName} src={topic.imageURL} maxHeight="200px" />
			<Box m="3">
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
							{isError && <AlertStatus status={error} />}
						</HStack>
					</>
				)}
			</Box>
		</Box>
	);
};

export default TopicCard;
