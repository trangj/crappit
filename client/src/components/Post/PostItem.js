import React, { useState } from "react";
import {
	Box,
	Heading,
	Text,
	HStack,
	Divider,
	Button,
	IconButton,
	Image,
} from "@chakra-ui/react";
import { AddIcon, LinkIcon, MinusIcon } from "@chakra-ui/icons";
import Voting from "./Voting";
import { Link } from "react-router-dom";
import moment from "moment";

const PostItem = ({ post }) => {
	const [open, setOpen] = useState(false);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg">
			<HStack m="3" spacing="0">
				<Voting post={post} />
				<Box>
					<Heading>
						<Link to={`/t/${post.topic}/comments/${post._id}`}>
							{post.title}
						</Link>
					</Heading>
					<Text fontSize="sm">
						<Link to={`/t/${post.topic}`} style={{ fontWeight: "bold" }}>
							t/{post.topic}
						</Link>{" "}
						| Posted by{" "}
						<Link to={`/user/${post.authorId}`}>u/{post.author}</Link>{" "}
						{moment(post.date).fromNow()}
					</Text>
					<HStack mt="2">
						{post.type === "link" ? (
							<a href={post.link} target="_blank" rel="noopener noreferrer">
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
							to={`/t/${post.topic}/comments/${post._id}#comments`}
							variant="ghost"
						>
							{post.comments.length} Comments
						</Button>
					</HStack>
				</Box>
			</HStack>
			{open && (
				<>
					<Divider />
					<Box id={post._id} m="3">
						{post.type === "photo" && (
							<Image
								alt={post.imageName}
								src={post.imageURL}
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
		</Box>
	);
};

export default PostItem;
