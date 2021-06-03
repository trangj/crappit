import React, { useContext, useState } from "react";
import { UserContext } from "../../context/UserState";
import { Heading, Image, Button, Text, HStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import useTopicFollow from "../../hooks/topic-query/useTopicFollow";
import UpdateTopic from "./UpdateTopic";
import Moderation from "./Moderation";
import Card from "../Utils/Card";

const TopicCard = ({ topic }) => {
	const { user, setUser } = useContext(UserContext);
	const [openEdit, setOpenEdit] = useState(false);
	const { isLoading, mutate } = useTopicFollow(topic);

	return (
		<Card>
			<Image alt={topic.imageName} src={topic.imageURL} maxHeight="200px" />
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
							<Button isLoading={isLoading} onClick={() => mutate(topic.id)}>
								{topic.user_followed_id ? "Unfollow" : "Follow"}
							</Button>
						)}
						<Button as={Link} to={`/t/${topic.title}/submit`}>
							Add Post
						</Button>
						{/* {user &&
							!!topic.moderators.filter((moderator) => moderator.id === user.id)
								.length && (
								<>
									<Button onClick={() => setOpenEdit(!openEdit)}>Edit</Button>
									<Moderation topic={topic} />
								</>
							)} */}
					</HStack>
				</>
			)}
		</Card>
	);
};

export default TopicCard;
