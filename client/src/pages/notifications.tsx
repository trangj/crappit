import { CheckIcon, CogIcon } from '@heroicons/react/outline';
import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import { Button } from 'src/ui/Button';
import dayjs from 'dayjs';
import { Card } from 'src/ui/Card';
import { Divider } from 'src/ui/Divider';
import { useUser } from 'src/context/UserState';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import useReadAllNotifications from 'src/hooks/notification-query/useReadAllNotifications';
import useNotifications from 'src/hooks/notification-query/useNotifications';
import useReadNotification from 'src/hooks/notification-query/useReadNotification';
import InfiniteScroll from 'react-infinite-scroller';
import NotificationSkeleton from 'src/components/util/NotificationSkeleton';
import { Avatar } from 'src/ui/Avatar';
import Image from 'next/image';
import NotificationIcon from 'src/components/notification/NotificationIcon';
import { parseTextFromHtml } from 'src/helpers/parseText';

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

  const {
    data, isLoading, fetchNextPage, isError, hasNextPage,
  } = useNotifications();
  const { mutate: readMutate } = useReadNotification();
  const { mutate: readAllMutate } = useReadAllNotifications();

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
          <Button variant="ghost" border="rounded" size="lg" icon={<CheckIcon className="h-6 w-6 mr-1" />} onClick={() => readAllMutate()}>
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
        {!isLoading && data ? (
          <InfiniteScroll
            pageStart={0}
            loadMore={() => fetchNextPage({ cancelRefetch: false })}
            hasMore={!isError && hasNextPage}
          >
            {data.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.notifications.map((notification) => (
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
                        <p
                          className="dark:text-gray-400 text-gray-500 overflow-hidden overflow-ellipsis whitespace-normal max-h-14 pt-0"
                          style={{
                            lineHeight: '18px',
                          }}
                        >
                          {parseTextFromHtml(notification.body)}
                        </p>
                      </div>
                    </a>
                    <Divider />
                  </span>
                ))}
              </React.Fragment>
            ))}
          </InfiniteScroll>
        ) : (
          <NotificationSkeleton />
        )}
      </Card>
    </div>
  );
}

export default NotificationsPage;
