import { CheckIcon, CogIcon } from '@heroicons/react/outline';
import axios from 'src/axiosConfig';
import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { Button } from 'src/ui/Button';
import dayjs from 'dayjs';
import { Card } from 'src/ui/Card';
import { Divider } from 'src/ui/Divider';
import { Notification } from 'src/types/entities/notification';
import toast from 'react-hot-toast';
import { useUser } from 'src/context/UserState';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

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

function NotificationsPage() {
  const { user } = useUser();
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const res = await axios.get('/api/notification');
        setNotifications(res.data);
      } catch {
        // toast.error('Failed to fetch notifcations');
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  const handleRead = async (notification_id : number) => {
    try {
      const res = await axios.post('/api/notification/read', {
        id: notification_id,
      });
      const newNotifications = notifications.map((notification) => {
        if (notification.id === res.data.id) {
          notification.read_at = res.data.read_at;
        }
        return notification;
      });
      setNotifications(newNotifications);
    } catch {
      toast.error('Failed to read notification');
    }
  };

  const handleReadAll = async () => {
    try {
      await axios.post('/api/notification/read_all');
      const newNotifications = notifications.map((notification) => {
        notification.read_at = new Date();
        return notification;
      });
      setNotifications(newNotifications);
    } catch {
      toast.error('Failed to read all notifications');
    }
  };

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="pt-16 mt-1 mx-auto max-w-2xl sm:px-5">
      <Head>
        <title>Notifications</title>
      </Head>
      <nav className="flex justify-between items-center">
        <h5>Notifications</h5>
        <div className="flex gap-1">
          <Button variant="ghost" border="rounded" size="lg" icon={<CheckIcon className="h-6 w-6 mr-1" />} onClick={() => handleReadAll()}>
            Mark as read
          </Button>
          <Link passHref href="/settings/notifications">
            <Button as="a" variant="ghost" border="rounded" size="lg" icon={<CogIcon className="h-6 w-6 mr-1" />}>
              Settings
            </Button>
          </Link>
        </div>
      </nav>
      <Card className="mt-4">
        {!loading ? notifications.map((notification) => (
          <span
            key={notification.id}
            onClick={() => handleRead(notification.id)}
          >
            <a
              href={notification.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-4 flex flex-col ${!notification.read_at && 'bg-opacity-20 bg-blue-500'}`}
            >
              <span>
                <span>
                  {notification.title}
                </span>
                <span className="dark:text-gray-400 text-gray-500">
                  {' '}
                  &bull;
                  {' '}
                  {dayjs(notification.sent_at).fromNow()}
                </span>
              </span>
              <span className="dark:text-gray-400 text-gray-500 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {notification.body.replace(/<\/?[^>]+>/gi, ' ')}
              </span>
            </a>
            <Divider />
          </span>
        )) : (
          <div className="p-4 flex flex-col gap-3">
            <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
            <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
            <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
          </div>
        )}
      </Card>
    </div>
  );
}

export default NotificationsPage;
