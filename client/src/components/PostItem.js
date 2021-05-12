import React, { useState } from "react";
import { Box, Heading, Text, HStack, Divider } from "@chakra-ui/react";
import { ArrowUpIcon, ArrowDownIcon } from "@chakra-ui/icons";
import Voting from "./Voting";
import { Link } from "react-router-dom";
import moment from "moment";

const PostItem = ({ post }) => {
	const [open, setOpen] = useState(false);

	return (
		<Box mb="2" borderWidth="1px" borderRadius="lg">
			<HStack ml="4" mt="4">
				<Voting post={post} />
				<Box>
					<Heading>
						<Link to={`/t/${post.topic}/p/${post._id}`}>{post.title}</Link>
					</Heading>
					<Text>
						Posted by
						<Link to={`/u/${post.authorId}`}> {post.author}</Link> |{" "}
						<Link to={`/t/${post.topic}`}>t/{post.topic}</Link> |{" "}
						<Link to={`/t/${post.topic}/p/${post._id}#comments`}>
							{post.comments.length} Comments
						</Link>{" "}
						| {moment(post.date).fromNow()}
					</Text>
				</Box>
			</HStack>
			<div
				style={{ textAlign: "center", cursor: "pointer", position: "relative" }}
				onClick={() => setOpen(!open)}
			>
				{open ? <ArrowUpIcon /> : <ArrowDownIcon />}
			</div>
			{open && (
				<>
					<Divider />
					<Box id={post._id} m="6">
						<img
							alt={post.imageName}
							src={post.imageURL}
							style={{
								display: "block",
								maxWidth: "100%",
								marginLeft: "auto",
								marginRight: "auto",
							}}
						/>
						<p>{post.content}</p>
					</Box>
				</>
			)}
		</Box>
	);
};

export default PostItem;
