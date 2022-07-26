import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Comment } from 'src/types/entities/comment';
import RichTextEditor from 'src/ui/RichTextEditorLazy';
import useAddReply from '../../hooks/comment-query/useAddReply';
import { Button } from '../../ui/Button';

const schema = yup.object({
  content: yup.string().required(''),
});

type Props = {
  comment: Comment,
  openReply: boolean,
  setOpenReply: (arg: boolean) => void;
};

interface FormValues {
  content: string;
}

function AddReply({ comment, openReply, setOpenReply }: Props) {
  const { isLoading, mutateAsync } = useAddReply(comment);

  const handleSubmit = async ({ content }: FormValues) => {
    const reply = {
      content,
      postId: comment.post_id,
    };
    try {
      await mutateAsync({
        commentId: comment.id,
        reply,
      });
      setOpenReply(false);
    } catch {
      //
    }
  };

  if (!openReply) return null;

  return (
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
          <div className="flex justify-end gap-2">
            <Button className="w-24" onClick={() => setOpenReply(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isLoading}
              disabled={!values.content}
              variant="filled"
              className="w-24"
            >
              Reply
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default AddReply;
