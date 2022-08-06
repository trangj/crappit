import React, { useEffect } from 'react';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import axios from '../axiosConfig';
import { Button } from '../ui/Button';
import { TextFieldForm } from '../ui/TextFieldForm';
import { useUser } from '../context/UserState';

const schema = yup.object({
  password: yup
    .string()
    .required('Enter a password')
    .min(6, 'Your password must be at least 6 characters long')
    .matches(/^(\S+$)/, 'Password cannot have any white space'),
  password2: yup
    .string()
    .oneOf([yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm your password'),
});

type ResetProps = {
  res: {
    status: {
      text: string,
      severity: string
    }
  }
}

interface FormValues {
  password: string,
  password2: string;
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    const res = await axios.get(`/api/user/reset/${query.token}`);
    return {
      props: {
        res: res.data,
      },
    };
  } catch (err) {
    return {
      redirect: {
        destination: '/',
        permanent: true,
      },
    };
  }
};

function Reset({ res }: ResetProps) {
  const router = useRouter();
  const { setUser } = useUser();
  const { token } = router.query;

  useEffect(() => {
    if (res) {
      toast.success(res.status.text);
    }
  }, [res]);

  const handleSubmit = async ({ password, password2 }: FormValues) => {
    try {
      const res = await axios.post(`/api/user/reset/${token}`, {
        password,
        password2,
      });
      router.push('/login');
      toast.success(res.data.status.text);
      setUser(null);
    } catch (err: any) {
      toast.error(err.response.data.status.text);
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-850 h-screen">
      <Head>
        <title>crappit.lol: Reset your password</title>
      </Head>
      <div className="bg-blue-300 w-32" />
      <div className="my-auto flex flex-col p-6 gap-2">
        <h5>Reset your password</h5>
        <span>Choose a new password here, then log in to your account.</span>
        <Formik
          initialValues={{ password: '', password2: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {() => (
            <Form>
              <Field
                label="Password"
                name="password"
                type="password"
                component={TextFieldForm}
              />
              <Field
                label="Verify Password"
                name="password2"
                type="password"
                component={TextFieldForm}
              />
              <Button type="submit" variant="filled" className="mt-3 px-3">
                Set Password
              </Button>
            </Form>
          )}
        </Formik>
        <div className="flex uppercase mt-1 text-xs font-bold gap-1 text-blue-500 dark:text-blue-400">
          <Link href="/login">
            <a>
              Log in
            </a>
          </Link>
          <span>
            •
          </span>
          <Link href="/register">
            <a>
              Sign up
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Reset;
