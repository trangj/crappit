import { Popover } from '@headlessui/react';
import { Button } from 'src/ui/Button';
import React, { useEffect, useMemo, useState } from 'react';
import { BellIcon, CheckIcon, CogIcon } from '@heroicons/react/outline';
import { Card } from 'src/ui/Card';
import Link from 'next/link';
import axios from 'src/axiosConfig';
import dayjs from 'dayjs';
import { Notification } from 'src/types/entities/notification';
import toast from 'react-hot-toast';

function NotificationPopover() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        setLoading(true);
        const res = await axios.get('/api/notification?limit=5');
        setNotifications(res.data);
      } catch {
        toast.error('Failed to fetch notifcations');
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

  const hasReadAll = useMemo(
    () => notifications.every((notification) => notification.read_at),
    [notifications],
  );

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button
            active={open}
            as={Button}
            variant="ghost"
            border="rounded"
            icon={(
              <>
                {!hasReadAll && <span className="bg-upvote rounded-full h-2 w-2 absolute top-0 right-0 m-1.5 shadow" />}
                <BellIcon className="h-6 w-6" />
              </>
            )}
          />
          <Popover.Panel className="absolute z-10 transform -translate-x-80 mt-2">
            <Card className="w-96">
              <nav className="p-4 flex items-center justify-between">
                <span className="font-medium">
                  Notifications
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" border="rounded" icon={<CheckIcon className="h-6 w-6" />} onClick={() => handleReadAll()} />
                  <Link passHref href="/settings/notifications">
                    <Button variant="ghost" border="rounded" as="a" icon={<CogIcon className="h-6 w-6" />} />
                  </Link>
                </div>
              </nav>
              <div className="max-h-80 overflow-y-auto overflow-hidden">
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
                  </span>
                )) : (
                  <div className="p-4 flex flex-col gap-3">
                    <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
                    <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
                    <div className="animate-pulse h-10 rounded w-full bg-gray-200 dark:bg-gray-700" />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-center p-3 h-12 dark:bg-gray-800 bg-gray-100">
                <span onClick={() => close()}>
                  <Link passHref href="/notifications">
                    <a className="uppercase text-blue-500 dark:text-blue-400 font-bold">
                      See all
                    </a>
                  </Link>
                </span>
              </div>
            </Card>
          </Popover.Panel>
        </>
      )}
    </Popover>
  );
}

export default NotificationPopover;
