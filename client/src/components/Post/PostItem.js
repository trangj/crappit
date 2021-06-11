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
import LinkCard from "../Utils/LinkCard";
import dayjs from "dayjs";

const PostItem = ({ post, ...props }) => {
	const [open, setOpen] = useState(false);

	return (
		<LinkCard {...props} mb="-1px">
			<HStack spacing="0">
				<Box mb="auto" zIndex="3">
					<Voting post={post} />
				</Box>
				<Box width="100%">
					<Heading size="md">
						<LinkOverlay as={Link} to={`/t/${post.topic}/comments/${post.id}`}>
							{post.title}
						</LinkOverlay>
					</Heading>
					<Text fontSize="sm">
						<Link to={`/t/${post.topic}`} style={{ fontWeight: "500" }}>
							t/{post.topic}
						</Link>{" "}
						| Posted by{" "}
						<Link to={`/user/${post.author_id}`}>u/{post.author}</Link>{" "}
						{dayjs(post.created_at).fromNow()}
					</Text>
					<HStack mt="2">
						{post.type === "link" ? (
							<a
								href={post.content}
								target="_blank"
								rel="noopener noreferrer"
								style={{ display: "inherit" }}
							>
								<IconButton
									aria-label="Open external link"
									size="xs"
									icon={<LinkIcon />}
									variant="ghost"
								/>
							</a>
						) : (
							<IconButton
								aria-label="Toggle more content"
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
							{post.number_of_comments}
							{post.number_of_comments === 1 ? " Comment" : " Comments"}
						</Button>
					</HStack>
					{open && (
						<>
							<Box id={post.id} mt="3">
								{post.type === "photo" && (
									<Image
										alt={post.image_name}
										src={post.image_url}
										maxHeight="600px"
										mx="auto"
									/>
								)}
								{post.type === "text" && (
									<Text mt="3" width={{ base: "100%", xl: "60%" }}>
										{post.content}
									</Text>
								)}
							</Box>
						</>
					)}
				</Box>
			</HStack>
		</LinkCard>
	);
};

export default PostItem;
