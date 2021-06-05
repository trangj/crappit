import React, { useContext, useState } from "react";
import DeletePostModerator from "./DeletePostModerator";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import Card from "../Utils/Card";
import moment from "moment";
import { Link } from "react-router-dom";
import { UserContext } from "../../context/UserState";
import { Box, Image, Heading, Text, HStack, Button } from "@chakra-ui/react";

const PostCard = ({ post, topic }) => {
	const { user } = useContext(UserContext);
	const [openEdit, setOpenEdit] = useState(false);

	return (
		<Card>
			<HStack spacing="0">
				<Box mb="auto">
					<Voting post={post} />
				</Box>
				<Box width="100%">
					<Text fontSize="xs">
						<Link to={`/t/${post.topic}`} style={{ fontWeight: "bold" }}>
							t/{post.topic}
						</Link>{" "}
						| Posted by{" "}
						<Link to={`/user/${post.author_id}`}>u/{post.author}</Link>{" "}
						{moment(post.created_at).fromNow()}
					</Text>
					{post.type === "link" ? (
						<a href={post.content} target="_blank" rel="noopener noreferrer">
							<Heading>{post.title}</Heading>
						</a>
					) : (
						<Heading>{post.title}</Heading>
					)}
					{openEdit ? (
						<UpdatePost
							post={post}
							openEdit={openEdit}
							setOpenEdit={setOpenEdit}
						/>
					) : (
						<>
							{post.type === "text" && <Text mt="1">{post.content}</Text>}
							{post.type === "photo" && (
								<Image
									alt={post.image_name}
									src={post.image_url}
									maxHeight="400px"
									mx="auto"
									pt="3"
								/>
							)}
							<HStack mt="1">
								<Button size="sm" variant="ghost">
									{post.number_of_comments}
									{post.number_of_comments === 1 ? " Comment" : " Comments"}
								</Button>
								{user && user.id === post.author_id && (
									<>
										<DeletePost post={post} />
										{post.type === "text" && (
											<Button
												size="sm"
												variant="ghost"
												onClick={() => setOpenEdit(!openEdit)}
											>
												Edit
											</Button>
										)}
									</>
								)}
								{user &&
									user.id !== post.author_id &&
									topic.user_moderator_id && (
										<DeletePostModerator post={post} />
									)}
							</HStack>
						</>
					)}
				</Box>
			</HStack>
		</Card>
	);
};

export default PostCard;
