import React from 'react';
import SettingsLayout from 'src/components/settings/SettingsLayout';
import { Divider } from 'src/ui/Divider';
import axios from 'src/axiosConfig';
import { useUser } from 'src/context/UserState';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import { NextPageWithLayout } from '../_app';

const ProfileSettingsPage : NextPageWithLayout = function () {
  const { user, setUser } = useUser();
  const router = useRouter();

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleAvatar : React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      if (!e.target.files) throw Error('No file was selected.');
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
    <div className="max-w-2xl flex flex-col">
      <h6 className="py-9">Customize Profile</h6>
      <small className="uppercase font-bold text-gray-500 dark:text-gray-400">
        Images
      </small>
      <Divider className="my-1" />
      <div className="flex flex-col gap-6 mt-6">
        <div className="flex flex-col gap-3">
          <div className="font-medium">Avatar image</div>
          <input type="file" accept=".png,.jpg,.jpeg" onChange={handleAvatar} />
          <small className="text-gray-500 dark:text-gray-400">
            Images must be in .png or .jpg format
          </small>
        </div>
      </div>
    </div>
  );
};

ProfileSettingsPage.getLayout = function getLayout(page) {
  return (
    <SettingsLayout>
      {page}
    </SettingsLayout>
  );
};

export default ProfileSettingsPage;
