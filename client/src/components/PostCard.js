import React, { useContext } from "react";
import DeletePost from "./DeletePost";
import UpdatePost from "./UpdatePost";
import Voting from "./Voting";
import moment from "moment";
import { Link } from "react-router-dom";
import { GlobalContext } from "../context/GlobalState";
import { Box, Image, Heading, Text, HStack } from "@chakra-ui/react";

const PostCard = () => {
	const { post, user } = useContext(GlobalContext);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg" overflow="hidden">
			<Image alt={post.imageName} src={post.imageURL} width="100%" />
			<Box m="4">
				<HStack>
					{post && <Voting post={post} />}
					<Box>
						<Heading>{post.title}</Heading>
						<Text fontSize="xs">
							Posted by <Link to={`/u/${post.authorId}`}> {post.author} </Link>{" "}
							| <Link to={`/t/${post.topic}`}>t/{post.topic}</Link> |{" "}
							{moment(post.date).fromNow()}
						</Text>
						<Text mt="2">{post.content}</Text>
					</Box>
				</HStack>
			</Box>
			{user && user._id === post.authorId && (
				<Box mb="4" mr="4" style={{ float: "right" }}>
					<DeletePost post={post} />
					<UpdatePost post={post} />
				</Box>
			)}
		</Box>
	);
};

export default PostCard;
