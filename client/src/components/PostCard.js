import React, { useContext, useState } from "react";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import moment from "moment";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { Box, Image, Heading, Text, HStack, Button } from "@chakra-ui/react";

const PostCard = () => {
	const { post, user } = useContext(GlobalContext);
	const [openEdit, setOpenEdit] = useState(false);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image alt={post.imageName} src={post.imageURL} width="100%" />
			<Box m="3">
				<HStack>
					{post && <Voting post={post} />}
					<Box width="100%">
						<Text fontSize="xs">
							<Link to={`/t/${post.topic}`} style={{ fontWeight: "bold" }}>
								t/{post.topic}
							</Link>{" "}
							| Posted by{" "}
							<Link to={`/u/${post.authorId}`}>u/{post.author}</Link>{" "}
							{moment(post.date).fromNow()}
						</Text>
						{openEdit ? (
							<UpdatePost
								post={post}
								openEdit={openEdit}
								setOpenEdit={setOpenEdit}
							/>
						) : (
							<>
								<Heading>{post.title}</Heading>
								<Text mt="3">{post.content}</Text>
								{user && user._id === post.authorId && (
									<HStack mt="3">
										<DeletePost post={post} />
										<Button size="sm" onClick={() => setOpenEdit(!openEdit)}>
											Edit
										</Button>
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
