import { Formik, Form, FormikHelpers } from 'formik';
import Link from 'next/link';
import React from 'react';
import * as yup from 'yup';
import RichTextEditor from 'src/ui/RichTextEditorLazy';
import { Button } from '../../ui/Button';
import { useUser } from '../../context/UserState';
import useAddComment from '../../hooks/comment-query/useAddComment';

const schema = yup.object({
  content: yup.string().required(''),
});

type Props = {
  post: string;
};

interface FormValues {
  content: string;
}

function AddComment({ post }: Props) {
  const { user } = useUser();
  const { isLoading, mutateAsync } = useAddComment(String(post));

  const handleSubmit = async (
    values: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    const { content } = values;
    const newComment = {
      content,
      postId: post,
    };
    try {
      await mutateAsync({
        newComment,
      });
      resetForm();
    } catch {
      //
    }
  };

  if (!user) {
    return (
      <div className="flex border rounded p-3 mb-3 border-gray-400 dark:border-gray-600 items-center">
        <div className="font-medium text-gray-500">
          Log in or sign up to leave a comment
        </div>
        <div className="flex flex-col sm:flex-row gap-2 ml-auto">
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
        Comment as
        {' '}
        <Link href={`/user/${user.id}`}>
          <a className="hover:underline text-blue-500 dark:text-blue-400">
            {user.username}
          </a>
        </Link>
      </small>
      <Formik
        initialValues={{ content: '' }}
        onSubmit={handleSubmit}
        validationSchema={schema}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <RichTextEditor
              value={values.content}
              placeholder="What are your thoughts?"
              name="content"
              setFieldValue={setFieldValue}
            />
            <Button
              type="submit"
              loading={isLoading}
              disabled={!values.content}
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
}

export default AddComment;
