import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserState";
import { Box, Heading, Image, Button, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation } from "react-query";
import { followTopic } from "../query/topic-query";
import AlertStatus from "./Utils/AlertStatus";
import UpdateTopic from "./UpdateTopic";

const TopicCard = ({ topic }) => {
	const { user, setUser } = useContext(UserContext);
	const [openEdit, setOpenEdit] = useState(false);
	const { isError, isLoading, error, mutate } = useMutation(followTopic, {
		onSuccess: (res) => {
			setUser(res.user);
		},
	});

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image alt={topic.imageName} src={topic.imageURL} maxHeight="200px" />
			<Box m="3">
				<Heading>Welcome to t/{topic.title}!</Heading>
				{openEdit ? (
					<UpdateTopic
						topic={topic}
						openEdit={openEdit}
						setOpenEdit={setOpenEdit}
					/>
				) : (
					<Text>{topic.description}</Text>
				)}
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
					<Button as={Link} to={`/t/${topic.title}/submit`} mr="2">
						Add Post
					</Button>
					<Button onClick={() => setOpenEdit(!openEdit)}>Edit</Button>
					{isError && <AlertStatus status={error} />}
				</Box>
			</Box>
		</Box>
	);
};

export default TopicCard;
