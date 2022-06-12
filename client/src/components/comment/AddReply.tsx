import React from 'react';
import { Formik, Form } from 'formik';
import * as yup from 'yup';
import { Comment } from 'src/types/entities/comment';
import { RichTextEditor } from 'src/ui/RichTextEditor';
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
  const { isLoading, mutate } = useAddReply(setOpenReply, comment);

  const handleSubmit = ({ content }: FormValues) => {
    const reply = {
      content,
      postId: comment.post_id,
    };
    mutate({
      commentId: comment.id,
      reply,
    });
  };

  if (!openReply) return null;

  return (
    <Formik
      initialValues={{ content: '' }}
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
