import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import SettingsLayout from 'src/components/settings/SettingsLayout';
import { useUser } from 'src/context/UserState';
import { Divider } from 'src/ui/Divider';
import axios from 'src/axiosConfig';
import { Switch } from '@headlessui/react';
import toast from 'react-hot-toast';
import { NextPageWithLayout } from '../_app';

type Setting = {
  user_id: number,
  notification_type_id: number,
  value: boolean,
  notification_type: {
    description: string
  }
}

const NotificationsSettingsPage : NextPageWithLayout = function () {
  const { user } = useUser();
  const router = useRouter();
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotificationSettings() {
      try {
        setLoading(true);
        const res = await axios.get('/api/notification/settings');
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (user) {
      fetchNotificationSettings();
    }
  }, [user]);

  if (!user) {
    router.push('/login');
    return null;
  }

  const handleChange = async (index: number) => {
    try {
      await axios.put('/api/notification/settings', {
        notification_type_id: settings[index].notification_type_id,
      });
      const newSettings = settings.map((setting, i) => {
        if (i === index) {
          setting.value = !setting.value;
        }
        return setting;
      });
      setSettings(newSettings);
      toast.success('Changes saved');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-2xl flex flex-col">
      <h6 className="py-9">Notification Settings</h6>
      <small className="uppercase font-bold text-gray-500 dark:text-gray-400">
        Activity
      </small>
      <Divider className="my-1" />
      <div className="flex flex-col gap-6 mt-6">
        {!loading && (
          <div className="flex flex-col gap-6">
            {settings.map((setting, i) => (
              <div className="flex justify-between items-center" key={i}>
                <span className="font-medium">
                  {setting.notification_type.description}
                </span>
                <Switch
                  checked={setting.value}
                  onChange={() => handleChange(i)}
                  className={`${
                    setting.value ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 items-center rounded-full`}
                >
                  <span className="sr-only">Enable notifications</span>
                  <span
                    className={`${
                      setting.value ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white`}
                  />
                </Switch>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

NotificationsSettingsPage.getLayout = function getLayout(page) {
  return (
    <SettingsLayout>
      {page}
    </SettingsLayout>
  );
};

export default NotificationsSettingsPage;
