import React, { useContext, useState } from "react";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import moment from "moment";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserState";
import { Box, Image, Heading, Text, HStack, Button } from "@chakra-ui/react";

const PostCard = ({ post }) => {
	const { user } = useContext(UserContext);
	const [openEdit, setOpenEdit] = useState(false);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			{post.type === "photo" && (
				<Image alt={post.imageName} src={post.imageURL} width="100%" />
			)}
			<Box m="3">
				<HStack>
					<Voting post={post} />
					<Box width="100%">
						<Text fontSize="xs">
							<Link to={`/t/${post.topic}`} style={{ fontWeight: "bold" }}>
								t/{post.topic}
							</Link>{" "}
							| Posted by{" "}
							<Link to={`/u/${post.authorId}`}>u/{post.author}</Link>{" "}
							{moment(post.date).fromNow()}
						</Text>
						{post.type === "link" ? (
							<a href={post.link} target="_blank" rel="noopener noreferrer">
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
								<Text mt="3">{post.content}</Text>
								{user && user._id === post.authorId && (
									<HStack mt="3">
										<DeletePost post={post} />
										{post.type === "text" && (
											<Button size="sm" onClick={() => setOpenEdit(!openEdit)}>
												Edit
											</Button>
										)}
									</HStack>
								)}
							</>
						)}
					</Box>
				</HStack>
			</Box>
		</Box>
	);
};

export default PostCard;
