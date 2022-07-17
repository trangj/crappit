import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { QueryClient } from 'react-query';
import { dehydrate } from 'react-query/hydration';
import Head from 'next/head';
import { useUser } from 'src/context/UserState';
import useTopic, { fetchTopic } from 'src/hooks/topic-query/useTopic';
import ModeratorLayout from 'src/components/moderator/ModeratorLayout';
import { Card } from 'src/ui/Card';
import Link from 'next/link';
import AddModerator from 'src/components/moderator/AddModerator';
import DeleteModerator from 'src/components/moderator/DeleteModerator';
import type { NextPageWithLayout } from 'src/pages/_app';

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  if (!req.cookies.crappit_session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(['topic', query.topic], () => fetchTopic(query.topic as string));
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

const TopicModerators : NextPageWithLayout = function () {
  const router = useRouter();
  const { topic } = router.query;
  const { user } = useUser();
  const { isLoading: topicLoading, data: topicData } = useTopic(
    topic as string,
  );

  if (topicLoading || !topicData) return <div>Loading...</div>;

  if (topicData.user_moderator_id !== user?.id) {
    return (
      <>
        <Head>
          <title>{topicData.title}</title>
        </Head>
        <div className="fixed inset-y-1/2 w-full text-center">
          You must be a moderator of t/
          {topicData.title}
          {' '}
          to view this page
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{topicData.title}</title>
      </Head>
      <Card className="p-3 flex flex-col gap-3 ml-64">
        <div>
          <span className="flex items-center">
            <h5>Moderators</h5>
            <AddModerator topic={topicData} />
          </span>
        </div>
        <div className="flex flex-col mt-2">
          {topicData.moderators.map((user, i) => (
            <div
              className="flex items-center justify-between py-2 border-t border-gray-300 dark:border-gray-700"
              key={i}
            >
              <Link passHref href={`/user/${user.user_id}`}>
                <a>
                  u/
                  {user.username}
                </a>
              </Link>
              <DeleteModerator topic={topicData} user={user} />
            </div>
          ))}
        </div>
      </Card>
    </>
  );
};

TopicModerators.getLayout = function getLayout(page) {
  return (
    <ModeratorLayout>
      {page}
    </ModeratorLayout>
  );
};

export default TopicModerators;
