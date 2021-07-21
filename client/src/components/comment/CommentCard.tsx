import React, { useState } from "react";
import CommentItem from "./CommentItem";
import * as yup from "yup";
import TextFieldForm from "../../ui/TextFieldForm";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { useUser } from "../../context/UserState";
import { Listbox } from '@headlessui/react';
import Link from "next/link";
import useAddComment from "../../hooks/comment-query/useAddComment";
import useComments from "../../hooks/comment-query/useComments";
import { Card, Button, Divider } from "../../ui";
import { Post } from "src/types/entities/post";
import { Topic } from "src/types/entities/topic";
import { useRouter } from "next/router";
import { ChatAlt2Icon } from "@heroicons/react/solid";
import CommentSkeleton from "../util/CommentSkeleton";

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
		isLoading: isCommentsLoading
	} = useComments(String(post.id), sortParam);
	const {
		isLoading,
		mutate
	} = useAddComment(String(post.id), sortParam);

	const handleSortChange = (sort: string) => {
		setSortParam(sort);
		router.push(`/t/${topic.title}/comments/${post.id}?sort=${sort}`, undefined, { shallow: true });
	};

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
		<Card id="comments" className="p-3">
			<div className="mx-6">
				{user ? (
					<>
						<small>
							Comment as <Link href={`/user/${user.id}`}><a className="hover:underline text-blue-500 dark:text-blue-400">{user.username}</a></Link>
						</small>
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
										loading={isLoading}
										disabled={!!!values.content}
										variant="filled"
										className="w-24 ml-auto"
									>
										Comment
									</Button>
								</Form>
							)}
						</Formik>
					</>
				) : (
					<div className="flex border rounded p-3 mb-3 border-gray-400 dark:border-gray-600 items-center">
						<p className="font-medium text-gray-500">
							Log in or sign up to leave a comment
						</p>
						<div className="flex gap-2 ml-auto">
							<Link passHref href="/login">
								<Button as="a" className="w-24">
									Login
								</Button>
							</Link>
							<Link passHref href="/register">
								<Button as="a" variant="filled" className="w-24">
									Register
								</Button>
							</Link>
						</div>
					</div>
				)}
				<Listbox value={sortParam} onChange={handleSortChange} as="div" className="relative">
					<Listbox.Button className="font-medium text-blue-600 dark:text-blue-400 text-xs capitalize" >Sort by: {sortParam === '' ? 'Hot' : sortParam}</Listbox.Button>
					<Listbox.Options className="cursor-pointer z-10 w-16 font-medium absolute left-0 origin-top-right border bg-white dark:bg-gray-850 border-gray-200 dark:border-gray-700 rounded flex flex-col">
						<Listbox.Option
							value="hot"
							className="p-2 hover:bg-blue-400 hover:bg-opacity-10"
						>
							{({ selected }) => (
								<span className={!selected ? 'opacity-50' : ''}>
									Hot
								</span>
							)}
						</Listbox.Option>
						<Listbox.Option
							value="new"
							className="p-2 hover:bg-blue-400 hover:bg-opacity-10"
						>
							{({ selected }) => (
								<span className={!selected ? 'opacity-50' : ''}>
									New
								</span>
							)}
						</Listbox.Option>
						<Listbox.Option
							value="top"
							className="p-2 hover:bg-blue-400 hover:bg-opacity-10"
						>
							{({ selected }) => (
								<span className={!selected ? 'opacity-50' : ''}>
									Top
								</span>
							)}
						</Listbox.Option>
					</Listbox.Options>
				</Listbox>
				<Divider className="mb-8 mt-1" />
			</div>
			{isCommentsLoading ? (
				<>
					<CommentSkeleton />
					<CommentSkeleton />
					<CommentSkeleton />
				</>
			) : (
				comments?.length === 0 ? (
					<div className="flex h-64 items-center justify-center">
						<div className="text-gray-400 text-center">
							<ChatAlt2Icon className="w-6 h-6 inline" />
							<p className="font-semibold">
								No Comments Yet
							</p>
							<small>
								Be the first to share what you think!
							</small>
						</div>
					</div>
				) : (
					comments?.map((comment) => (
						<CommentItem comment={comment} key={comment.id} topic={topic} />
					))
				)
			)}
		</Card>
	);
};

export default CommentCard;
