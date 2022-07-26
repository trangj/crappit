import React from 'react';
import * as yup from 'yup';
import { Formik, Form } from 'formik';
import { Comment } from 'src/types/entities/comment';
import RichTextEditor from 'src/ui/RichTextEditorLazy';
import useUpdateComment from '../../hooks/comment-query/useUpdateComment';
import { Button } from '../../ui/Button';

const schema = yup.object({
  content: yup.string().required(''),
});

type Props = {
  comment: Comment,
  openEdit: boolean,
  setOpenEdit: (arg: boolean) => void;
};

interface FormValues {
  content: string;
}

function UpdateComment({ comment, openEdit, setOpenEdit }: Props) {
  const { isLoading, mutateAsync } = useUpdateComment(comment);

  const handleSubmit = async ({ content }: FormValues) => {
    const newComment = {
      content,
    };
    try {
      await mutateAsync({
        commentId: comment.id,
        newComment,
      });
      setOpenEdit(false);
    } catch {
      //
    }
  };

  if (!openEdit) return null;

  return (
    <Formik
      initialValues={{ content: comment.content }}
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

export default UpdateComment;
