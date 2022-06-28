import React, { useRef, useState } from 'react';
import {
  Formik, Form, Field, FormikHelpers,
} from 'formik';
import * as yup from 'yup';
import { Topic } from 'src/types/entities/topic';
import { Dialog } from '@headlessui/react';
import useAddModerator from '../../hooks/moderator-query/useAddModerator';
import { Button } from '../../ui/Button';
import { TextFieldForm } from '../../ui/TextFieldForm';

const schema = yup.object({
  username: yup.string().required(''),
});

type Props = {
  topic: Topic;
};

interface FormValues {
  username: string;
}

function AddModerator({ topic }: Props) {
  const [open, setOpen] = useState(false);
  const { isLoading, mutate } = useAddModerator(topic);
  const cancelRef = useRef(null);

  const handleSubmit = (
    { username }: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    mutate({
      topic: topic.title,
      username,
    });
    resetForm();
  };

  return (
    <>
      <Button
        variant="filled"
        className="ml-auto"
        onClick={() => setOpen(true)}
      >
        Add User
      </Button>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={open}
        onClose={() => setOpen(false)}
        initialFocus={cancelRef}
      >
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30 z-50" />
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-4">
            <Dialog.Title as="h6">Invite Moderators</Dialog.Title>
            <Formik
              initialValues={{ username: '' }}
              onSubmit={handleSubmit}
              validationSchema={schema}
            >
              {({ values }) => (
                <Form>
                  <Field
                    placeholder="Enter username"
                    name="username"
                    component={TextFieldForm}
                  />
                  <div className="flex mt-3 justify-end gap-2">
                    <Button onClick={() => setOpen(false)} ref={cancelRef}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={isLoading}
                      disabled={!values.username}
                      variant="filled"
                    >
                      Add User
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </Dialog>
    </>
  );
}

export default AddModerator;
