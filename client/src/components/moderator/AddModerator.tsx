import React, { useRef, useState } from 'react';
import {
  Formik, Form, Field, FormikHelpers,
} from 'formik';
import * as yup from 'yup';
import { Topic } from 'src/types/entities/topic';
import { Dialog } from '@headlessui/react';
import { Divider } from 'src/ui/Divider';
import useAddModerator from '../../hooks/moderator-query/useAddModerator';
import { Button } from '../../ui/Button';
import { TextFieldForm } from '../../ui/TextFieldForm';

const schema = yup.object({
  username: yup.string().required(''),
  can_manage_posts_and_comments: yup.bool().required(''),
  can_manage_settings: yup.bool().required(''),
  can_manage_everything: yup.bool().required(''),
});

type Props = {
  topic: Topic;
};

interface FormValues {
  username: string;
  can_manage_posts_and_comments: boolean,
  can_manage_settings: boolean,
  can_manage_everything: boolean,
  select_all: boolean,
}

function AddModerator({ topic }: Props) {
  const [open, setOpen] = useState(false);
  const { isLoading, mutateAsync } = useAddModerator(topic);
  const cancelRef = useRef(null);

  const handleSubmit = async (
    {
      username, can_manage_posts_and_comments, can_manage_settings, can_manage_everything,
    }: FormValues,
    { resetForm }: FormikHelpers<FormValues>,
  ) => {
    try {
      await mutateAsync({
        topic: topic.title,
        username,
        can_manage_posts_and_comments,
        can_manage_settings,
        can_manage_everything,
      });
      resetForm();
    } catch {
      //
    }
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
          <div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-md w-full mx-auto z-50 p-4">
            <Dialog.Title as="h6">Invite Moderators</Dialog.Title>
            <Formik
              initialValues={{
                username: '', can_manage_posts_and_comments: true, can_manage_settings: true, can_manage_everything: true, select_all: true,
              }}
              onSubmit={handleSubmit}
              validationSchema={schema}
            >
              {({ values, setFieldValue }) => (
                <Form className="flex flex-col gap-3">
                  <Field
                    placeholder="Enter username"
                    name="username"
                    component={TextFieldForm}
                  />
                  <h6>Give them access to...</h6>
                  <div className="flex gap-2">
                    <Field type="hidden" name="can_manage_everything" id="can_manage_everything" />
                    <input
                      type="checkbox"
                      name="select_all"
                      id="select_all"
                      checked={values.select_all}
                      onChange={(e) => {
                        setFieldValue('select_all', e.target.checked);
                        setFieldValue('can_manage_everything', e.target.checked);
                        setFieldValue('can_manage_settings', e.target.checked);
                        setFieldValue('can_manage_posts_and_comments', e.target.checked);
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Everything</span>
                      <small>
                        Full access including the ability to manage
                        moderator access and permissions
                      </small>
                    </div>
                  </div>
                  <Divider />
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      name="can_manage_settings"
                      id="can_manage_settings"
                      checked={values.can_manage_settings}
                      onChange={(e) => {
                        setFieldValue('can_manage_settings', e.target.checked);
                        setFieldValue('can_manage_everything', false);
                        setFieldValue('select_all', false);
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Manage Settings</span>
                      <small>Manage community settings, appearance, and rules.</small>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="checkbox"
                      name="can_manage_posts_and_comments"
                      id="can_manage_posts_and_comments"
                      checked={values.can_manage_posts_and_comments}
                      onChange={(e) => {
                        setFieldValue('can_manage_posts_and_comments', e.target.checked);
                        setFieldValue('can_manage_everything', false);
                        setFieldValue('select_all', false);
                      }}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-bold">Manage Posts & Comments</span>
                      <small>Take action and manage content.</small>
                    </div>
                  </div>
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
