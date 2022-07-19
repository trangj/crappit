import React from 'react';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { Formik, Form, Field } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useUser } from '../context/UserState';
import { Button } from '../ui/Button';
import { TextFieldForm } from '../ui/TextFieldForm';

const schema = yup.object({
  username: yup
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .required('Enter your username'),
  password: yup.string().required('Enter your password'),
});

interface FormValues {
  username: string;
  password: string;
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (req.cookies.crappit_session) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

function Login() {
  const { loginUser } = useUser();
  const router = useRouter();

  const handleSubmit = async ({ username, password }: FormValues) => {
    try {
      const user = {
        username,
        password,
      };
      const res = await loginUser(user);
      toast.success(res.data.status.text);
      router.back();
    } catch (err: any) {
      toast.error(err.status.text);
    }
  };

  return (
    <div className="flex bg-white dark:bg-gray-850 h-screen">
      <Head>
        <title>crappit: Log in</title>
      </Head>
      <div className="bg-blue-300 w-32" />
      <div className="my-auto flex flex-col p-6 gap-2">
        <h6>Login</h6>
        <small>
          By continuing, you agree to our User Agreement and Privacy Policy.
        </small>
        <Formik
          initialValues={{ username: '', password: '' }}
          onSubmit={handleSubmit}
          validationSchema={schema}
        >
          {() => (
            <Form className="w-72 flex flex-col">
              <a
                className="uppercase mt-4 text-sm border rounded font-semibold p-4 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-black"
                href={`${process.env.NEXT_PUBLIC_SERVER_URL}/api/user/google`}
              >
                Continue with Google
              </a>
              <div className="flex justify-between items-center my-4">
                <span className="border-b border-gray-300 dark:border-gray-700 w-2/5" />
                <span className="text-gray-500 dark:text-gray-400">OR</span>
                <span className="border-b border-gray-300 dark:border-gray-700 w-2/5" />
              </div>
              <Field
                label="Username"
                name="username"
                type="username"
                component={TextFieldForm}
              />
              <Field
                label="Password"
                name="password"
                type="password"
                component={TextFieldForm}
              />
              <Button type="submit" className="mt-3" variant="filled">
                Login
              </Button>
            </Form>
          )}
        </Formik>
        <small className="flex flex-col gap-4 mt-4">
          <div>
            Forgot your
            {' '}
            <Link href="/forgot" passHref>
              <a className="text-blue-500 dark:text-blue-400">password</a>
            </Link>
            ?
          </div>
          <div>
            New to Crappit?
            {' '}
            <Link href="/register" passHref>
              <a className="text-blue-500 dark:text-blue-400">Sign up</a>
            </Link>
          </div>
        </small>
      </div>
    </div>
  );
}

export default Login;
