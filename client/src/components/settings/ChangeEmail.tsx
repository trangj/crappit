import { Dialog } from '@headlessui/react';
import { Formik, Form, Field } from 'formik';
import React, { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useUser } from 'src/context/UserState';
import { Button } from 'src/ui/Button';
import { TextFieldForm } from 'src/ui/TextFieldForm';
import * as yup from 'yup';
import axios from '../../axiosConfig';

const schema = yup.object({
  password: yup.string().required(''),
  newEmail: yup.string().email('Enter a valid email').required(''),
});

interface FormValues {
  password: string;
  newEmail: string;
}

function ChangeEmail() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user, setUser } = useUser();
  const cancelRef = useRef(null);

  const handleEmail = async ({ password, newEmail }: FormValues) => {
    try {
      setLoading(true);
      const res = await axios.post('/api/user/email', { newEmail, password });
      setLoading(false);
      setUser({ ...user, email: res.data.user.email } as any);
      setOpen(false);
      toast.success(res.data.status.text);
    } catch (err: any) {
      toast.error(err.response.data.status.text);
      setLoading(false);
    }
  };

  const initialValues: FormValues = {
    password: '',
    newEmail: '',
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} className="ml-auto">
        Change
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
          <div className="bg-white dark:bg-gray-850 rounded border border-gray-200 dark:border-gray-700 max-w-sm mx-auto z-50 p-3 gap-3 flex flex-col">
            <Dialog.Title as="h6">Update your email</Dialog.Title>
            <Dialog.Description>
              Update your email below. There will be a new verification email
              sent that you will need to use to verify this new email.
            </Dialog.Description>
            <Formik
              initialValues={initialValues}
              onSubmit={handleEmail}
              validationSchema={schema}
            >
              {({ isValid }) => (
                <Form>
                  <Field
                    label="Current Password"
                    name="password"
                    type="password"
                    component={TextFieldForm}
                  />
                  <Field
                    label="New Email"
                    name="newEmail"
                    type="email"
                    component={TextFieldForm}
                  />
                  <div className="flex mt-3 justify-end gap-2">
                    <Button onClick={() => setOpen(false)} ref={cancelRef}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      disabled={!isValid}
                      variant="filled"
                    >
                      Save Email
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

export default ChangeEmail;
