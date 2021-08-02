import { Formik, Form, FormikHelpers } from 'formik';
import Link from 'next/link';
import React from 'react';
import { Button } from '../../ui/Button';
import { useUser } from '../../context/UserState';
import * as yup from "yup";
import useAddComment from "../../hooks/comment-query/useAddComment";
import { Post } from '../../types/entities/post';
import { RichTextEditor } from 'src/ui/RichTextEditor';

const schema = yup.object({
    content: yup.string().required(""),
});

type Props = {
    post: Post,
    sortParam: string;
};

interface FormValues {
    content: string;
};

const AddComment = ({ post, sortParam }: Props) => {
    const { user } = useUser();
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


    if (!user) {
        return (
            <div className="flex border rounded p-3 mb-3 border-gray-400 dark:border-gray-600 items-center">
                <div className="font-medium text-gray-500">
                    Log in or sign up to leave a comment
                </div>
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
        );
    }

    return (
        <>
            <small>
                Comment as <Link href={`/user/${user.id}`}><a className="hover:underline text-blue-500 dark:text-blue-400">{user.username}</a></Link>
            </small>
            <Formik
                initialValues={{
                    content: '<p></p>'
                }}
                onSubmit={handleSubmit}
                validationSchema={schema}
            >
                {({ values, setFieldValue, isSubmitting }) => (
                    <Form>
                        <RichTextEditor
                            value={values.content}
                            placeholder="What are your thoughts?"
                            name="content"
                            setFieldValue={setFieldValue}
                            isSubmitting={isSubmitting}
                        />
                        <Button
                            type="submit"
                            loading={isLoading}
                            disabled={values.content === '<p></p>'}
                            variant="filled"
                            className="w-24 ml-auto"
                        >
                            Comment
                        </Button>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default AddComment;
