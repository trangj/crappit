import React, { useState } from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "../forms/TextFieldForm";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useUser } from "../../context/UserState";
import { Box, Button, Divider, Flex, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup, Text } from "@chakra-ui/react";
import Link from "next/link";
import useAddComment from "../../hooks/comment-query/useAddComment";
import useComments from "../../hooks/comment-query/useComments";
import Card from "../utils/Card";
import { Post } from "src/types/entities/post";
import { Topic } from "src/types/entities/topic";
import { useRouter } from "next/router";
import { ChatIcon } from "@chakra-ui/icons";

const schema = yup.object({
	content: yup.string().required(""),
});

type Props = {
	post: Post,
	topic: Topic;
};

interface FormValues {
	content: string;
};

const CommentCard = ({ post, topic }: Props) => {
	const { user } = useUser();
	const router = useRouter();

	const sort = router.query.sort ? router.query.sort as string : "";

	const [sortParam, setSortParam] = useState(sort);
	const {
		data: comments,
	} = useComments(String(post.id), sortParam);
	const {
		isLoading,
		mutate
	} = useAddComment(String(post.id), sortParam);

	const handleSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
		const { content } = values;
		const newComment = {
			content,
			postId: post.id,
		};
		mutate({
			newComment,
		});
		resetForm();
	};

	return (
		<Card id="comments">
			{user ? (
				<>
					<Text>
						Comment as <Link href={`/user/${user.id}`}>{user.username}</Link>
					</Text>
					<Formik
						initialValues={{ content: "" }}
						onSubmit={handleSubmit}
						validationSchema={schema}
					>
						{({ values }) => (
							<Form>
								<Field
									name="content"
									multiline
									component={TextFieldForm}
									placeholder="What are your thoughts?"
								/>
								<Button
									type="submit"
									isLoading={isLoading}
									isDisabled={!!!values.content}
									mt="2"
								>
									Comment
								</Button>
							</Form>
						)}
					</Formik>
				</>
			) : (
				<Flex border="1px" borderRadius="md" p="3" my="2" borderColor="gray.600" alignItems="center">
					<Text color="gray.400" fontWeight="semibold">
						Log in or sign up to leave a comment
					</Text>
					<Flex ml="auto">
						<Link href="/login" passHref>
							<Button as="a">
								Login
							</Button>
						</Link>
						<Link href="/register" passHref>
							<Button as="a" ml="2">
								Register
							</Button>
						</Link>
					</Flex>
				</Flex>
			)}
			<Menu>
				<MenuButton mt="2" color="gray.400">
					<Text fontSize="small" fontWeight="medium">
						Sort by {sortParam === "created_at" ? "New" : sortParam === "vote" ? "Top" : "Hot"}
					</Text>
				</MenuButton>
				<MenuList>
					<MenuOptionGroup
						defaultValue=""
						type="radio"
						onChange={val => {
							setSortParam(val as string);
							router.push(`/t/${topic.title}/comments/${post.id}?sort=${val}`, undefined, { shallow: true });
						}}
						value={sortParam}
					>
						<MenuItemOption value="">Hot</MenuItemOption>
						<MenuItemOption value="created_at">New</MenuItemOption>
						<MenuItemOption value="vote">Top</MenuItemOption>
					</MenuOptionGroup>
				</MenuList>
			</Menu>
			<Divider pt="3" />
			{comments && (comments.length === 0 ? (
				<Flex height={250} alignItems="center" justifyContent="center">
					<Box color="gray.400" textAlign="center">
						<ChatIcon mb="2" w={6} h={6} />
						<Text fontWeight="semibold">
							No Comments Yet
						</Text>
						<small>
							Be the first to share what you think!
						</small>
					</Box>
				</Flex>
			) : (
				comments.map((comment) => (
					<CommentItem comment={comment} key={comment.id} topic={topic} />
				))
			))}
		</Card>
	);
};

export default CommentCard;
