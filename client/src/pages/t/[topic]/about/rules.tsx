import React from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import useTopic from 'src/hooks/topic-query/useTopic';
import ModeratorLayout from 'src/components/moderator/ModeratorLayout';
import { Card } from 'src/ui/Card';
import { Disclosure } from '@headlessui/react';
import { ArrowsExpandIcon } from '@heroicons/react/outline';
import dayjs from 'dayjs';
import AddRule from 'src/components/moderator/AddRule';
import DeleteRule from 'src/components/moderator/DeleteRule';
import { Button } from 'src/ui/Button';
import { Divider } from 'src/ui/Divider';
import type { NextPageWithLayout } from 'src/pages/_app';

export const getServerSideProps: GetServerSideProps = async ({
  req,
}) => {
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

const TopicRules : NextPageWithLayout = function () {
  const router = useRouter();
  const { topic } = router.query;
  const { isLoading: topicLoading, data: topicData } = useTopic(
    topic as string,
  );

  if (topicLoading || !topicData) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{topicData.title}</title>
      </Head>
      <Card className="p-3 flex flex-col gap-3 ml-64">
        <div>
          <span className="flex items-center">
            <h5>Rules</h5>
            {topicData.can_manage_settings && <AddRule topic={topicData} />}
          </span>
          <p>
            These are rules that visitors must follow to participate. They can be
            used as reasons to report or ban posts, comments, and users.
            Communities can have a maximum of 15 rules.
          </p>
        </div>
        <div>
          {topicData.rules.length === 0 ? (
            <div className="h-72 flex justify-center items-center font-bold">
              No rules yet
            </div>
          ) : (
            topicData.rules.map((rule, i) => (
              <Disclosure key={i}>
                <Divider className="mt-4" />
                <div className="font-medium pt-4 w-full flex items-center text-sm justify-between">
                  <span>
                    {i + 1}
                    .
                    {' '}
                    {rule.name}
                  </span>
                  <div className="flex gap-2">
                    {topicData.can_manage_settings && <DeleteRule topic={topicData} rule={rule} />}
                    <Disclosure.Button as={Button} variant="ghost" border="rounded" size="sm" icon={<ArrowsExpandIcon className="h-4 w-4" />} />
                  </div>
                </div>
                <Disclosure.Panel className="content px-4 pb-4">
                  <small className="text-gray-500 dark:text-gray-400">
                    Description
                  </small>
                  <div>{rule.description}</div>
                  <small className="text-gray-500 dark:text-gray-400">
                    Created
                  </small>
                  <div>{dayjs(rule.created_at).fromNow()}</div>
                </Disclosure.Panel>
              </Disclosure>
            ))
          )}
        </div>
      </Card>
    </>
  );
};

TopicRules.getLayout = function getLayout(page) {
  return (
    <ModeratorLayout>
      {page}
    </ModeratorLayout>
  );
};

export default TopicRules;
