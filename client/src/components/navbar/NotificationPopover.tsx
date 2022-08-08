import { Popover } from '@headlessui/react';
import { Button } from 'src/ui/Button';
import React, { useMemo } from 'react';
import { BellIcon, CheckIcon, CogIcon } from '@heroicons/react/outline';
import { Card } from 'src/ui/Card';
import Link from 'next/link';
import dayjs from 'dayjs';
import ToolTip from 'src/ui/ToolTip';
import useNotifications from 'src/hooks/notification-query/useNotifications';
import useReadNotification from 'src/hooks/notification-query/useReadNotification';
import useReadAllNotifications from 'src/hooks/notification-query/useReadAllNotifications';
import Image from 'next/image';
import { Avatar } from 'src/ui/Avatar';
import { parseTextFromHtml } from 'src/helpers/parseText';
import NotificationSkeleton from '../util/NotificationSkeleton';
import NotificationIcon from '../notification/NotificationIcon';

function NotificationPopover() {
  const { data, isLoading } = useNotifications();
  const { mutate: readMutate } = useReadNotification();
  const { mutate: readAllMutate } = useReadAllNotifications();

  const hasReadAll = useMemo(
    () => (data
      ? data.pages[0].notifications.every((notification) => notification.read_at) : true),
    [data],
  );

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <ToolTip
            title="Notifications"
          >
            <Popover.Button
              as={Button}
              active={open}
              variant="ghost"
              border="rounded"
              icon={(
                <>
                  {!hasReadAll && <span className="bg-upvote rounded-full h-2 w-2 absolute top-0 right-0 m-1.5 shadow" />}
                  <BellIcon className="h-6 w-6" />
                </>
              )}
            />
          </ToolTip>
          <Popover.Panel className="absolute z-10 transform -translate-x-80 mt-2">
            <Card className="w-96">
              <nav className="p-4 flex items-center justify-between">
                <span className="font-medium">
                  Notifications
                </span>
                <div className="flex gap-1">
                  <Button variant="ghost" border="rounded" size="xs" icon={<CheckIcon className="h-6 w-6" />} onClick={() => readAllMutate()} />
                  <Link passHref href="/settings/notifications">
                    <Button variant="ghost" border="rounded" as="a" size="xs" icon={<CogIcon className="h-6 w-6" />} />
                  </Link>
                </div>
              </nav>
              <div className="max-h-80 overflow-y-auto overflow-hidden">
                {!isLoading && data ? data.pages[0].notifications.map((notification) => (
                  <span
                    key={notification.id}
                    onClick={() => readMutate({ id: notification.id })}
                  >
                    <a
                      href={notification.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`p-4 flex gap-2 ${!notification.read_at && 'bg-opacity-20 bg-blue-500'}`}
                    >
                      <a className="h-8 w-8 relative flex-none">
                        {!notification.icon_name ? (
                          <Avatar />
                        ) : (
                          <Image
                            alt="user avatar"
                            src={notification.icon_name}
                            width={32}
                            height={32}
                            className="rounded-full bg-white"
                          />
                        )}
                        <span className="bg-white dark:bg-black border border-white rounded-full h-5 w-5 absolute -bottom-2 -right-0.5 p-0.5 text-blue-500">
                          <NotificationIcon type={notification.notification_type.type_name} />
                        </span>
                      </a>
                      <div className="flex flex-col">
                        <p>
                          <span>
                            {notification.title}
                          </span>
                          <span className="dark:text-gray-400 text-gray-500">
                            {' '}
                            &bull;
                            {' '}
                            {dayjs(notification.sent_at).fromNow()}
                          </span>
                        </p>
                        <p
                          className="dark:text-gray-400 text-gray-500 overflow-hidden overflow-ellipsis whitespace-normal max-h-14 p-0"
                          style={{
                            lineHeight: '18px',
                          }}
                        >
                          {parseTextFromHtml(notification.body)}
                        </p>
                      </div>
                    </a>
                  </span>
                )) : (
                  <NotificationSkeleton />
                )}
              </div>
              <div className="flex items-center justify-center p-3 h-12 dark:bg-gray-800 bg-gray-100">
                <span onClick={() => close()}>
                  <Link passHref href="/notifications">
                    <a className="uppercase text-blue-500 dark:text-blue-400 font-bold text-sm">
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
