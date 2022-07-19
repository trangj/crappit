import React from 'react';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import Head from 'next/head';
import axios from '../axiosConfig';
import { Button } from '../ui/Button';
import { TextFieldForm } from '../ui/TextFieldForm';

const schema = yup.object({
  email: yup.string().email('Enter a valid email').required('Enter an email'),
});

interface FormValues {
  email: string;
}

function Forgot() {
  const handleSubmit = async ({ email }: FormValues) => {
    try {
      const res = await axios.post('/api/user/forgot', { email });
      toast.success(res.data.status.text);
    } catch (err: any) {
      toast.error(err.response.data.status.text);
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-850 h-screen">
      <Head>
        <title>crappit: Reset your password</title>
      </Head>
      <div className="bg-blue-300 w-32" />
      <div className="my-auto flex flex-col p-6 gap-2 max-w-md">
        <h6>Reset your password</h6>
        <div>
          Tell us the email address associated with your Reddit account, and
          we’ll send you an email with a link to reset your password.
        </div>
        <Formik
          initialValues={{ email: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {({ isValid }) => (
            <Form>
              <Field
                label="Email"
                name="email"
                type="email"
                component={TextFieldForm}
              />
              <Button
                type="submit"
                variant="filled"
                className="px-5 mt-3"
                disabled={!isValid}
              >
                Reset Password
              </Button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default Forgot;
