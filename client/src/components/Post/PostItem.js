import React, { useState } from "react";
import {
	Box,
	Heading,
	Text,
	HStack,
	Button,
	IconButton,
	Image,
	LinkOverlay,
} from "@chakra-ui/react";
import { AddIcon, LinkIcon, MinusIcon } from "@chakra-ui/icons";
import Voting from "./Voting";
import { Link } from "react-router-dom";
import moment from "moment";
import LinkCard from "../Utils/LinkCard";

const PostItem = ({ post }) => {
	const [open, setOpen] = useState(false);

	return (
		<LinkCard>
			<HStack spacing="0">
				<Voting post={post} />
				<Box>
					<Heading>
						<LinkOverlay as={Link} to={`/t/${post.topic}/comments/${post.id}`}>
							{post.title}
						</LinkOverlay>
					</Heading>
					<Text fontSize="sm">
						<Link to={`/t/${post.topic}`} style={{ fontWeight: "bold" }}>
							t/{post.topic}
						</Link>{" "}
						| Posted by{" "}
						<Link to={`/user/${post.author_id}`}>u/{post.author}</Link>{" "}
						{moment(post.created_at).fromNow()}
					</Text>
					<HStack mt="2">
						{post.type === "link" ? (
							<a href={post.content} target="_blank" rel="noopener noreferrer">
								<IconButton size="xs" icon={<LinkIcon />} variant="ghost" />
							</a>
						) : (
							<IconButton
								size="xs"
								onClick={() => setOpen(!open)}
								icon={open ? <MinusIcon /> : <AddIcon />}
								variant="ghost"
							/>
						)}
						<Button
							size="xs"
							as={Link}
							to={`/t/${post.topic}/comments/${post.id}#comments`}
							variant="ghost"
						>
							{post.numberOfComments} Comments
						</Button>
					</HStack>
				</Box>
			</HStack>
			{open && (
				<>
					<Box id={post.id} mt="3">
						{post.type === "photo" && (
							<Image
								alt={post.image_name}
								src={post.image_url}
								style={{
									display: "block",
									maxWidth: "100%",
									maxHeight: "400px",
									marginLeft: "auto",
									marginRight: "auto",
								}}
							/>
						)}
						{post.type === "text" && <Text mt="3">{post.content}</Text>}
					</Box>
				</>
			)}
		</LinkCard>
	);
};

export default PostItem;
