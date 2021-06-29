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
	ChakraProps,
} from "@chakra-ui/react";
import { AddIcon, LinkIcon, MinusIcon } from "@chakra-ui/icons";
import Voting from "./Voting";
import Link from "next/link";
import LinkCard from "../utils/LinkCard";
import dayjs from "dayjs";
import { Post } from "src/types/entities/post";

type Props = ChakraProps & {
	post: Post;
};

const PostItem = ({ post, ...props }: Props) => {
	const [open, setOpen] = useState(false);

	return (
		<LinkCard mb="-1px" {...props}>
			<HStack spacing="0">
				<Box mb="auto" zIndex="3">
					<Voting post={post} />
				</Box>
				<Box width="100%">
					<Heading size="md">
						<Link passHref href={`/t/${post.topic}/comments/${post.id}`}>
							<LinkOverlay as="a">
								{post.title}
							</LinkOverlay>
						</Link>
					</Heading>
					<Text fontSize="sm">
						<Link passHref href={`/t/${post.topic}`}>
							<a style={{ fontWeight: 500 }}>
								t/{post.topic}
							</a>
						</Link>{" "}
						| Posted by{" "}
						<Link passHref href={`/user/${post.author_id}`}>
							<a>
								u/{post.author}
							</a>
						</Link>{" "}
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
						<Link passHref href={`/t/${post.topic}/comments/${post.id}#comments`}>
							<Button
								as="a"
								size="xs"
								variant="ghost"
							>
								{post.number_of_comments}
								{post.number_of_comments === 1 ? " Comment" : " Comments"}
							</Button>
						</Link>
					</HStack>
					{open && (
						<>
							<Box id={String(post.id)} mt="3">
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
