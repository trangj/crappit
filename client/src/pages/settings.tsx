import React from 'react';
import toast from 'react-hot-toast';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ChangeEmail from 'src/components/settings/ChangeEmail';
import { useUser } from '../context/UserState';
import axios from '../axiosConfig';
import { Button } from '../ui/Button';
import { Divider } from '../ui/Divider';

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  if (!req.cookies.crappit_session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

function Settings() {
  const router = useRouter();
  const { user, setUser } = useUser();

  if (!user) {
    router.push('/login');
    return null;
  }

  const handlePassword = async (email: string) => {
    try {
      const res = await axios.post('/api/user/forgot', { email });
      toast.success(res.data.status.text);
    } catch (err: any) {
      toast.error(err.response.data.status.text);
    }
  };

  const handleAvatar = async (e: any) => {
    try {
      const file = e.target.files[0];
      if (
        file.type !== 'image/png'
        && file.type !== 'image/jpg'
        && file.type !== 'image/jpeg'
      ) throw Error('Invalid file type');
      const formData = new FormData();
      formData.append('file', file);
      const res = await axios.post(`/api/user/${user.id}/avatar`, formData);
      setUser({ ...user, ...res.data.user });
      toast.success(res.data.status.text);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-850 h-screen">
      <Head>
        <title>Crappit Settings</title>
      </Head>
      <div className="pt-16 container mx-auto max-w-5xl px-5">
        <div className="max-w-2xl flex flex-col gap-3">
          <h5>Account Settings</h5>
          <Divider className="my-1" />
          <div className="flex items-center">
            <div>
              <div className="font-medium">Change password</div>
              <small className="text-gray-500 dark:text-gray-400">
                Password must be 6 characters long
              </small>
            </div>
            <Button
              onClick={() => handlePassword(user.email)}
              className="ml-auto"
            >
              Change
            </Button>
          </div>
          <div className="flex items-center">
            <div>
              <div className="font-medium">Email address</div>
              <small className="text-gray-500 dark:text-gray-400">
                {user.email}
              </small>
            </div>
            <ChangeEmail />
          </div>
          <h5>Customize Profile</h5>
          <Divider className="my-1" />
          <div className="font-medium">Avatar image</div>
          <input type="file" accept=".png,.jpg,.jpeg" onChange={handleAvatar} />
          <small className="text-gray-500 dark:text-gray-400">
            Images must be in .png or .jpg format
          </small>
        </div>
      </div>
    </div>
  );
}

export default Settings;
