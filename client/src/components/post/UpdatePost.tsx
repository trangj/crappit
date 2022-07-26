import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Post } from 'src/types/entities/post';
import { Button } from 'src/ui/Button';
import RichTextEditor from 'src/ui/RichTextEditorLazy';
import useUpdatePost from '../../hooks/post-query/useUpdatePost';

const schema = yup.object({
  content: yup.string().required(''),
});

type Props = {
  post: Post;
  openEdit: boolean,
  setOpenEdit: (arg: boolean) => void;
};

interface FormData {
  content: string;
}

function UpdatePost({ post, openEdit, setOpenEdit }: Props) {
  const { isLoading, mutateAsync } = useUpdatePost(post);

  const handleSubmit = async ({ content }: FormData) => {
    const newPost = {
      content,
    };
    try {
      await mutateAsync({
        postid: post.id,
        newPost,
      });
      setOpenEdit(false);
    } catch {
      //
    }
  };

  if (!openEdit) return null;

  return (
    <Formik
      initialValues={{ content: post.content }}
      onSubmit={handleSubmit}
      validationSchema={schema}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <RichTextEditor
            value={values.content}
            placeholder="Text (optional)"
            name="content"
            setFieldValue={setFieldValue}
          />
          <div className="flex justify-end gap-2">
            <Button className="w-24" onClick={() => setOpenEdit(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={!values.content}
              variant="filled"
              className="w-24"
            >
              Update
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default UpdatePost;
