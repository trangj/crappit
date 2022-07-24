import React from 'react';
import toast from 'react-hot-toast';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import ChangeEmail from 'src/components/settings/ChangeEmail';
import SettingsLayout from 'src/components/settings/SettingsLayout';
import { useUser } from '../../context/UserState';
import axios from '../../axiosConfig';
import { Button } from '../../ui/Button';
import { Divider } from '../../ui/Divider';
import { NextPageWithLayout } from '../_app';

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

const AccountSettingsPage : NextPageWithLayout = function () {
  const router = useRouter();
  const { user } = useUser();

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

  return (
    <div className="max-w-2xl flex flex-col">
      <h6 className="py-9">Account Settings</h6>
      <small className="uppercase font-bold text-gray-500 dark:text-gray-400">
        Account Preferences
      </small>
      <Divider className="my-1" />
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex items-center">
          <div>
            <div className="font-medium">Email address</div>
            <small className="text-gray-500 dark:text-gray-400">
              {user.email}
            </small>
          </div>
          <ChangeEmail />
        </div>
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
      </div>
    </div>
  );
};

AccountSettingsPage.getLayout = function getLayout(page) {
  return (
    <SettingsLayout>
      {page}
    </SettingsLayout>
  );
};

export default AccountSettingsPage;
